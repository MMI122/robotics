<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class WishlistController extends Controller
{
    /**
     * Display the user's wishlist
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 12);
        $sortBy = $request->get('sort', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');

        $query = Wishlist::with(['product.category'])
            ->where('user_id', Auth::id())
            ->whereHas('product', function ($q) {
                $q->where('is_active', true);
            });

        // Sorting
        $allowedSorts = ['created_at', 'product.name', 'product.price'];
        if (in_array($sortBy, $allowedSorts)) {
            if ($sortBy === 'product.name') {
                $query->join('products', 'wishlists.product_id', '=', 'products.id')
                    ->orderBy('products.name', $sortDirection)
                    ->select('wishlists.*');
            } elseif ($sortBy === 'product.price') {
                $query->join('products', 'wishlists.product_id', '=', 'products.id')
                    ->orderByRaw('COALESCE(products.sale_price, products.price) ' . $sortDirection)
                    ->select('wishlists.*');
            } else {
                $query->orderBy($sortBy, $sortDirection);
            }
        }

        $wishlistItems = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $wishlistItems,
            'message' => 'Wishlist retrieved successfully'
        ]);
    }

    /**
     * Add product to wishlist
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $product = Product::findOrFail($request->product_id);
            
            // Check if product is active
            if (!$product->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product is not available'
                ], 400);
            }

            // Check if product is already in wishlist
            $existingItem = Wishlist::where('user_id', Auth::id())
                ->where('product_id', $request->product_id)
                ->first();

            if ($existingItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product is already in your wishlist'
                ], 400);
            }

            $wishlistItem = Wishlist::create([
                'user_id' => Auth::id(),
                'product_id' => $request->product_id
            ]);

            $wishlistItem->load('product.category');

            return response()->json([
                'success' => true,
                'data' => $wishlistItem,
                'message' => 'Product added to wishlist successfully'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add product to wishlist: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove product from wishlist
     */
    public function destroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $wishlistItem = Wishlist::where('user_id', Auth::id())
                ->where('product_id', $request->product_id)
                ->first();

            if (!$wishlistItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found in wishlist'
                ], 404);
            }

            $wishlistItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product removed from wishlist successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove product from wishlist: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove specific wishlist item
     */
    public function remove(Wishlist $wishlistItem)
    {
        // Check if wishlist item belongs to authenticated user
        if ($wishlistItem->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $wishlistItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product removed from wishlist successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove product from wishlist: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clear entire wishlist
     */
    public function clear()
    {
        try {
            Wishlist::where('user_id', Auth::id())->delete();

            return response()->json([
                'success' => true,
                'message' => 'Wishlist cleared successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear wishlist: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if product is in user's wishlist
     */
    public function check(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $isInWishlist = Wishlist::where('user_id', Auth::id())
            ->where('product_id', $request->product_id)
            ->exists();

        return response()->json([
            'success' => true,
            'data' => ['in_wishlist' => $isInWishlist],
            'message' => 'Wishlist status checked successfully'
        ]);
    }

    /**
     * Get wishlist count
     */
    public function count()
    {
        $count = Wishlist::where('user_id', Auth::id())
            ->whereHas('product', function ($q) {
                $q->where('is_active', true);
            })
            ->count();

        return response()->json([
            'success' => true,
            'data' => ['count' => $count],
            'message' => 'Wishlist count retrieved successfully'
        ]);
    }

    /**
     * Move items from wishlist to cart
     */
    public function moveToCart(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'wishlist_ids' => 'required|array',
            'wishlist_ids.*' => 'exists:wishlists,id'
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

            $movedItems = [];
            $failedItems = [];

            foreach ($request->wishlist_ids as $wishlistId) {
                $wishlistItem = Wishlist::where('id', $wishlistId)
                    ->where('user_id', Auth::id())
                    ->with('product')
                    ->first();

                if (!$wishlistItem) {
                    continue;
                }

                // Check if product is still available and in stock
                if (!$wishlistItem->product->is_active || !$wishlistItem->product->in_stock) {
                    $failedItems[] = [
                        'product_name' => $wishlistItem->product->name,
                        'reason' => 'Product is not available'
                    ];
                    continue;
                }

                // Check if already in cart
                $existingCartItem = \App\Models\Cart::where('user_id', Auth::id())
                    ->where('product_id', $wishlistItem->product_id)
                    ->first();

                if ($existingCartItem) {
                    $failedItems[] = [
                        'product_name' => $wishlistItem->product->name,
                        'reason' => 'Already in cart'
                    ];
                    continue;
                }

                // Add to cart
                \App\Models\Cart::create([
                    'user_id' => Auth::id(),
                    'product_id' => $wishlistItem->product_id,
                    'quantity' => 1
                ]);

                // Remove from wishlist
                $wishlistItem->delete();

                $movedItems[] = $wishlistItem->product->name;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => [
                    'moved_items' => $movedItems,
                    'failed_items' => $failedItems
                ],
                'message' => count($movedItems) . ' items moved to cart successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to move items to cart: ' . $e->getMessage()
            ], 500);
        }
    }
}
