<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $includeProducts = $request->get('include_products', false);
        $onlyParent = $request->get('only_parent', false);
        $withCounts = $request->get('with_counts', false);

        $query = Category::where('is_active', true);

        // Only get parent categories (no parent_id)
        if ($onlyParent) {
            $query->whereNull('parent_id');
        }

        // Include products count
        if ($withCounts) {
            $query->withCount(['products' => function ($q) {
                $q->where('is_active', true);
            }]);
        }

        // Include products
        if ($includeProducts) {
            $query->with(['products' => function ($q) {
                $q->where('is_active', true)->limit(8);
            }]);
        }

        // Load subcategories
        $query->with(['children' => function ($q) use ($withCounts) {
            $q->where('is_active', true);
            if ($withCounts) {
                $q->withCount(['products' => function ($subQ) {
                    $subQ->where('is_active', true);
                }]);
            }
        }]);

        $categories = $query->orderBy('sort_order')->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
            'message' => 'Categories retrieved successfully'
        ]);
    }

    /**
     * Get category tree (hierarchical structure)
     */
    public function tree()
    {
        $categories = Cache::remember('category_tree', 3600, function () {
            return Category::where('is_active', true)
                ->whereNull('parent_id')
                ->with(['children' => function ($query) {
                    $query->where('is_active', true)
                        ->withCount(['products' => function ($q) {
                            $q->where('is_active', true);
                        }])
                        ->orderBy('sort_order')
                        ->orderBy('name');
                }])
                ->withCount(['products' => function ($q) {
                    $q->where('is_active', true);
                }])
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get();
        });

        return response()->json([
            'success' => true,
            'data' => $categories,
            'message' => 'Category tree retrieved successfully'
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->only(['name', 'description', 'parent_id', 'is_active', 'sort_order']);
            $data['slug'] = Str::slug($request->name);
            
            // Handle duplicate slugs
            $originalSlug = $data['slug'];
            $counter = 1;
            while (Category::where('slug', $data['slug'])->exists()) {
                $data['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }

            // Handle image upload
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('categories', 'public');
                $data['image'] = 'storage/' . $path;
            }

            $category = Category::create($data);

            // Clear cache
            Cache::forget('category_tree');

            return response()->json([
                'success' => true,
                'data' => $category,
                'message' => 'Category created successfully'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create category: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $category = Category::where('slug', $slug)
            ->where('is_active', true)
            ->with(['children' => function ($q) {
                $q->where('is_active', true);
            }])
            ->withCount(['products' => function ($q) {
                $q->where('is_active', true);
            }])
            ->first();

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found'
            ], 404);
        }

        // Get featured products from this category
        $featuredProducts = Product::where('category_id', $category->id)
            ->where('is_active', true)
            ->where('is_featured', true)
            ->limit(6)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'category' => $category,
                'featured_products' => $featuredProducts
            ],
            'message' => 'Category retrieved successfully'
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->only(['name', 'description', 'parent_id', 'is_active', 'sort_order']);
            
            // Handle slug update
            if ($request->name !== $category->name) {
                $data['slug'] = Str::slug($request->name);
                
                // Handle duplicate slugs
                $originalSlug = $data['slug'];
                $counter = 1;
                while (Category::where('slug', $data['slug'])->where('id', '!=', $category->id)->exists()) {
                    $data['slug'] = $originalSlug . '-' . $counter;
                    $counter++;
                }
            }

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image
                if ($category->image && file_exists(public_path($category->image))) {
                    unlink(public_path($category->image));
                }
                
                $path = $request->file('image')->store('categories', 'public');
                $data['image'] = 'storage/' . $path;
            }

            $category->update($data);

            // Clear cache
            Cache::forget('category_tree');

            return response()->json([
                'success' => true,
                'data' => $category,
                'message' => 'Category updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update category: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        try {
            // Check if category has products
            if ($category->products()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete category with existing products'
                ], 400);
            }

            // Check if category has subcategories
            if ($category->children()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete category with subcategories'
                ], 400);
            }

            // Delete image
            if ($category->image && file_exists(public_path($category->image))) {
                unlink(public_path($category->image));
            }

            $category->delete();

            // Clear cache
            Cache::forget('category_tree');

            return response()->json([
                'success' => true,
                'message' => 'Category deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete category: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get products by category
     */
    public function products(Request $request, string $slug)
    {
        $category = Category::where('slug', $slug)
            ->where('is_active', true)
            ->first();

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found'
            ], 404);
        }

        $perPage = $request->get('per_page', 12);
        $sortBy = $request->get('sort', 'name');
        $sortDirection = $request->get('sort_direction', 'asc');

        $query = Product::where('category_id', $category->id)
            ->where('is_active', true)
            ->with(['category']);

        // Apply sorting
        $allowedSorts = ['name', 'price', 'created_at', 'avg_rating'];
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
            'data' => [
                'category' => $category,
                'products' => $products
            ],
            'message' => 'Category products retrieved successfully'
        ]);
    }
}
