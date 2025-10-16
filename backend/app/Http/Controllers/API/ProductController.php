<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Http\Requests\StoreProductRequest;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 12);
        $sortBy = $request->get('sort', 'name');
        $sortDirection = $request->get('sort_direction', 'asc');
        $category = $request->get('category');
        $search = $request->get('search');
        $priceMin = $request->get('price_min');
        $priceMax = $request->get('price_max');
        $featured = $request->get('featured');
        $inStock = $request->get('in_stock');

        $query = Product::with(['category', 'reviews'])
            ->where('is_active', true);

        // Search functionality
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%")
                  ->orWhere('sku', 'LIKE', "%{$search}%")
                  ->orWhere('short_description', 'LIKE', "%{$search}%");
            });
        }

        // Category filter
        if ($category) {
            $query->whereHas('category', function ($q) use ($category) {
                $q->where('slug', $category)->orWhere('id', $category);
            });
        }

        // Price range filter
        if ($priceMin) {
            $query->where(function ($q) use ($priceMin) {
                $q->where('sale_price', '>=', $priceMin)
                  ->orWhere(function ($subQ) use ($priceMin) {
                      $subQ->whereNull('sale_price')->where('price', '>=', $priceMin);
                  });
            });
        }

        if ($priceMax) {
            $query->where(function ($q) use ($priceMax) {
                $q->where('sale_price', '<=', $priceMax)
                  ->orWhere(function ($subQ) use ($priceMax) {
                      $subQ->whereNull('sale_price')->where('price', '<=', $priceMax);
                  });
            });
        }

        // Featured filter
        if ($featured) {
            $query->where('is_featured', true);
        }

        // In stock filter
        if ($inStock) {
            $query->where('stock_quantity', '>', 0)->where('in_stock', true);
        }

        // Sorting
        $allowedSorts = ['name', 'price', 'created_at', 'avg_rating', 'views'];
        if (in_array($sortBy, $allowedSorts)) {
            if ($sortBy === 'price') {
                $query->orderByRaw('COALESCE(sale_price, price) ' . $sortDirection);
            } else {
                $query->orderBy($sortBy, $sortDirection);
            }
        }

        $products = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $products,
            'message' => 'Products retrieved successfully'
        ]);
    }

    /**
     * Display a listing of all products for admin (including inactive)
     */
    public function adminIndex(Request $request)
    {
        $perPage = $request->get('per_page', 12);
        $sortBy = $request->get('sort', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $category = $request->get('category');
        $search = $request->get('search');
        $status = $request->get('status'); // active, inactive, all

        $query = Product::with(['category', 'reviews']);

        // Status filter for admin
        if ($status === 'active') {
            $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        }
        // If status is 'all' or not provided, show all products

        // Search functionality
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%")
                  ->orWhere('sku', 'LIKE', "%{$search}%")
                  ->orWhere('short_description', 'LIKE', "%{$search}%");
            });
        }

        // Category filter
        if ($category) {
            $query->whereHas('category', function ($q) use ($category) {
                $q->where('slug', $category)->orWhere('id', $category);
            });
        }

        // Sorting
        $allowedSortFields = ['name', 'price', 'stock_quantity', 'created_at', 'updated_at'];
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortDirection);
        }

        $products = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $products,
            'message' => 'Products retrieved successfully'
        ]);
    }

    /**
     * Get featured products
     */
    public function featured()
    {
        $products = Cache::remember('featured_products', 3600, function () {
            return Product::with(['category'])
                ->where('is_featured', true)
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->limit(8)
                ->get();
        });

        return response()->json([
            'success' => true,
            'data' => ProductResource::collection($products),
            'message' => 'Featured products retrieved successfully'
        ]);
    }

    /**
     * Search products
     */
    public function search(Request $request)
    {
        $query = $request->get('q');
        
        if (!$query) {
            return response()->json([
                'success' => false,
                'message' => 'Search query is required'
            ], 400);
        }

        $products = Product::with(['category'])
            ->where('is_active', true)
            ->where(function ($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%")
                  ->orWhere('description', 'LIKE', "%{$query}%")
                  ->orWhere('sku', 'LIKE', "%{$query}%");
            })
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => ProductResource::collection($products),
            'message' => 'Search results retrieved successfully'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        try {
            DB::beginTransaction();

            $data = $request->validated();
            $data['slug'] = Str::slug($data['name']);
            
            // Handle duplicate slugs
            $originalSlug = $data['slug'];
            $counter = 1;
            while (Product::where('slug', $data['slug'])->exists()) {
                $data['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }

            // Handle image uploads
            if ($request->hasFile('featured_image')) {
                $data['featured_image'] = $this->uploadImage($request->file('featured_image'));
            }

            if ($request->hasFile('images')) {
                $images = [];
                foreach ($request->file('images') as $image) {
                    $images[] = $this->uploadImage($image);
                }
                $data['images'] = json_encode($images);
            }

            // Handle specifications
            if ($request->has('specifications')) {
                $data['specifications'] = is_string($request->specifications) 
                    ? json_decode($request->specifications, true) 
                    : $request->specifications;
            }

            $product = Product::create($data);

            DB::commit();

            // Clear cache
            Cache::forget('featured_products');

            return response()->json([
                'success' => true,
                'data' => new ProductResource($product->load(['category'])),
                'message' => 'Product created successfully'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create product: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $product = Product::with(['category', 'reviews.user'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->first();

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        // Increment views
        $product->increment('views');

        // Get related products
        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->limit(4)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'product' => new ProductResource($product),
                'related_products' => ProductResource::collection($relatedProducts)
            ],
            'message' => 'Product retrieved successfully'
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreProductRequest $request, Product $product)
    {
        try {
            DB::beginTransaction();

            $data = $request->validated();
            
            // Handle slug update
            if ($data['name'] !== $product->name) {
                $data['slug'] = Str::slug($data['name']);
                
                // Handle duplicate slugs
                $originalSlug = $data['slug'];
                $counter = 1;
                while (Product::where('slug', $data['slug'])->where('id', '!=', $product->id)->exists()) {
                    $data['slug'] = $originalSlug . '-' . $counter;
                    $counter++;
                }
            }

            // Handle image updates
            if ($request->hasFile('featured_image')) {
                // Delete old image
                if ($product->featured_image) {
                    Storage::delete($product->featured_image);
                }
                $data['featured_image'] = $this->uploadImage($request->file('featured_image'));
            }

            if ($request->hasFile('images')) {
                // Delete old images
                if ($product->images) {
                    $oldImages = json_decode($product->images, true);
                    foreach ($oldImages as $oldImage) {
                        Storage::delete($oldImage);
                    }
                }
                
                $images = [];
                foreach ($request->file('images') as $image) {
                    $images[] = $this->uploadImage($image);
                }
                $data['images'] = json_encode($images);
            }

            // Handle specifications
            if ($request->has('specifications')) {
                $data['specifications'] = is_string($request->specifications) 
                    ? json_decode($request->specifications, true) 
                    : $request->specifications;
            }

            $product->update($data);

            DB::commit();

            // Clear cache
            Cache::forget('featured_products');

            return response()->json([
                'success' => true,
                'data' => new ProductResource($product->load(['category'])),
                'message' => 'Product updated successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update product: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        try {
            // Delete images
            if ($product->featured_image) {
                Storage::delete($product->featured_image);
            }
            
            if ($product->images) {
                $images = json_decode($product->images, true);
                foreach ($images as $image) {
                    Storage::delete($image);
                }
            }

            $product->delete();

            // Clear cache
            Cache::forget('featured_products');

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete product: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload additional images for a product
     */
    public function uploadImages(Request $request, Product $product)
    {
        $validator = Validator::make($request->all(), [
            'images' => 'required|array',
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
            $newImages = [];
            foreach ($request->file('images') as $image) {
                $newImages[] = $this->uploadImage($image);
            }

            // Merge with existing images
            $existingImages = $product->images ? json_decode($product->images, true) : [];
            $allImages = array_merge($existingImages, $newImages);

            $product->update(['images' => json_encode($allImages)]);

            return response()->json([
                'success' => true,
                'data' => ['images' => $allImages],
                'message' => 'Images uploaded successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload images: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Helper method to upload image
     */
    private function uploadImage($image)
    {
        $path = $image->store('products', 'public');
        return 'storage/' . $path;
    }

    /**
     * Get product recommendations using ML
     */
    public function recommendations(Request $request, Product $product)
    {
        // This will integrate with our ML service
        $recommendations = Cache::remember("recommendations_{$product->id}", 3600, function () use ($product) {
            // For now, return similar products by category
            return Product::where('category_id', $product->category_id)
                ->where('id', '!=', $product->id)
                ->where('is_active', true)
                ->inRandomOrder()
                ->limit(6)
                ->get();
        });

        return response()->json([
            'success' => true,
            'data' => ProductResource::collection($recommendations),
            'message' => 'Product recommendations retrieved successfully'
        ]);
    }
}
