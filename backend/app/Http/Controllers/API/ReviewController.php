<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    /**
     * Display reviews for a product
     */
    public function index(Request $request, Product $product)
    {
        $perPage = $request->get('per_page', 10);
        $sortBy = $request->get('sort', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $rating = $request->get('rating');

        $query = Review::with(['user'])
            ->where('product_id', $product->id)
            ->where('is_approved', true);

        // Filter by rating
        if ($rating) {
            $query->where('rating', $rating);
        }

        // Sorting
        $allowedSorts = ['created_at', 'rating', 'helpful_count'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDirection);
        }

        $reviews = $query->paginate($perPage);

        // Get rating statistics
        $ratingStats = Review::where('product_id', $product->id)
            ->where('is_approved', true)
            ->select(
                DB::raw('AVG(rating) as average_rating'),
                DB::raw('COUNT(*) as total_reviews'),
                DB::raw('SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star'),
                DB::raw('SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star'),
                DB::raw('SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star'),
                DB::raw('SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star'),
                DB::raw('SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star')
            )
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'reviews' => $reviews,
                'statistics' => $ratingStats
            ],
            'message' => 'Reviews retrieved successfully'
        ]);
    }

    /**
     * Store a new review
     */
    public function store(Request $request, Product $product)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'required|string|max:255',
            'comment' => 'required|string|max:1000',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Check if user has already reviewed this product
            $existingReview = Review::where('user_id', Auth::id())
                ->where('product_id', $product->id)
                ->first();

            if ($existingReview) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have already reviewed this product'
                ], 400);
            }

            // Check if user has purchased this product
            $hasPurchased = Order::where('user_id', Auth::id())
                ->whereHas('orderItems', function ($query) use ($product) {
                    $query->where('product_id', $product->id);
                })
                ->where('status', 'delivered')
                ->exists();

            if (!$hasPurchased) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only review products you have purchased'
                ], 400);
            }

            DB::beginTransaction();

            // Handle image uploads
            $images = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('reviews', 'public');
                    $images[] = 'storage/' . $path;
                }
            }

            // Create review
            $review = Review::create([
                'user_id' => Auth::id(),
                'product_id' => $product->id,
                'rating' => $request->rating,
                'title' => $request->title,
                'comment' => $request->comment,
                'images' => !empty($images) ? json_encode($images) : null,
                'is_approved' => true, // Auto-approve for now
                'is_verified_purchase' => true
            ]);

            // Update product rating
            $this->updateProductRating($product);

            DB::commit();

            $review->load('user');

            return response()->json([
                'success' => true,
                'data' => $review,
                'message' => 'Review created successfully'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create review: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified review
     */
    public function show(Review $review)
    {
        $review->load(['user', 'product']);

        return response()->json([
            'success' => true,
            'data' => $review,
            'message' => 'Review retrieved successfully'
        ]);
    }

    /**
     * Update the specified review
     */
    public function update(Request $request, Review $review)
    {
        // Check if review belongs to authenticated user
        if ($review->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'required|string|max:255',
            'comment' => 'required|string|max:1000',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Handle image uploads
            $images = [];
            if ($request->hasFile('images')) {
                // Delete old images
                if ($review->images) {
                    $oldImages = json_decode($review->images, true);
                    foreach ($oldImages as $oldImage) {
                        if (file_exists(public_path($oldImage))) {
                            unlink(public_path($oldImage));
                        }
                    }
                }

                foreach ($request->file('images') as $image) {
                    $path = $image->store('reviews', 'public');
                    $images[] = 'storage/' . $path;
                }
            }

            // Update review
            $review->update([
                'rating' => $request->rating,
                'title' => $request->title,
                'comment' => $request->comment,
                'images' => !empty($images) ? json_encode($images) : $review->images,
                'is_approved' => true // Reset approval if needed
            ]);

            // Update product rating
            $this->updateProductRating($review->product);

            DB::commit();

            $review->load('user');

            return response()->json([
                'success' => true,
                'data' => $review,
                'message' => 'Review updated successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update review: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified review
     */
    public function destroy(Review $review)
    {
        // Check if review belongs to authenticated user
        if ($review->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            DB::beginTransaction();

            $product = $review->product;

            // Delete review images
            if ($review->images) {
                $images = json_decode($review->images, true);
                foreach ($images as $image) {
                    if (file_exists(public_path($image))) {
                        unlink(public_path($image));
                    }
                }
            }

            $review->delete();

            // Update product rating
            $this->updateProductRating($product);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Review deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete review: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark review as helpful
     */
    public function markHelpful(Review $review)
    {
        $review->increment('helpful_count');

        return response()->json([
            'success' => true,
            'message' => 'Review marked as helpful'
        ]);
    }

    /**
     * Get user's reviews
     */
    public function userReviews(Request $request)
    {
        $perPage = $request->get('per_page', 10);

        $reviews = Review::with(['product'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $reviews,
            'message' => 'User reviews retrieved successfully'
        ]);
    }

    /**
     * Update product average rating
     */
    private function updateProductRating(Product $product)
    {
        $avgRating = Review::where('product_id', $product->id)
            ->where('is_approved', true)
            ->avg('rating');

        $reviewCount = Review::where('product_id', $product->id)
            ->where('is_approved', true)
            ->count();

        $product->update([
            'avg_rating' => round($avgRating, 2),
            'review_count' => $reviewCount
        ]);
    }
}
