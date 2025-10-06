<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    /**
     * Display the user's cart
     */
    public function index()
    {
        try {
            \Log::info('Cart index request', ['user_id' => Auth::id()]);
            
            $cartItems = Cart::with(['product.category'])
                ->where('user_id', Auth::id())
                ->get();

            $total = $cartItems->sum(function ($item) {
                $price = $item->product->sale_price ?? $item->product->price;
                return $price * $item->quantity;
            });

            \Log::info('Cart retrieved', ['items_count' => $cartItems->count(), 'total' => $total]);

            return response()->json([
                'success' => true,
                'data' => [
                    'items' => $cartItems,
                    'total' => $total,
                    'count' => $cartItems->sum('quantity')
                ],
                'message' => 'Cart retrieved successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Cart index error', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve cart: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add item to cart
     */
    public function store(Request $request)
    {
        try {
            \Log::info('Cart store request', ['request' => $request->all(), 'user_id' => Auth::id()]);
            
            $validator = Validator::make($request->all(), [
                'product_id' => 'required|exists:products,id',
                'quantity' => 'required|integer|min:1|max:100'
            ]);

            if ($validator->fails()) {
                \Log::error('Cart validation failed', ['errors' => $validator->errors()]);
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $product = Product::findOrFail($request->product_id);
            \Log::info('Found product', ['product_id' => $product->id]);
            
            // Check if product is active and in stock
            if (!$product->is_active || !$product->in_stock) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product is not available'
                ], 400);
            }

            // Check stock quantity
            if ($product->stock_quantity < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient stock. Available: ' . $product->stock_quantity
                ], 400);
            }

            \Log::info('Checking existing cart item', ['user_id' => Auth::id(), 'product_id' => $request->product_id]);
            
            // Check if item already exists in cart
            $existingItem = Cart::where('user_id', Auth::id())
                ->where('product_id', $request->product_id)
                ->first();

            if ($existingItem) {
                $newQuantity = $existingItem->quantity + $request->quantity;
                
                if ($newQuantity > $product->stock_quantity) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Total quantity exceeds available stock'
                    ], 400);
                }
                
                $existingItem->update(['quantity' => $newQuantity]);
                $cartItem = $existingItem;
                \Log::info('Updated existing cart item', ['cart_item_id' => $cartItem->id]);
            } else {
                \Log::info('Creating new cart item', ['user_id' => Auth::id(), 'product_id' => $request->product_id, 'quantity' => $request->quantity]);
                $cartItem = Cart::create([
                    'user_id' => Auth::id(),
                    'product_id' => $request->product_id,
                    'quantity' => $request->quantity
                ]);
                \Log::info('Created new cart item', ['cart_item_id' => $cartItem->id]);
            }

            $cartItem->load('product.category');

            return response()->json([
                'success' => true,
                'data' => $cartItem,
                'message' => 'Item added to cart successfully'
            ]);

        } catch (\Exception $e) {
            \Log::error('Cart store error', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to add item to cart: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, Cart $cartItem)
    {
        // Check if cart item belongs to authenticated user
        if ($cartItem->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $product = $cartItem->product;
            
            // Check stock quantity
            if ($product->stock_quantity < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient stock. Available: ' . $product->stock_quantity
                ], 400);
            }

            $cartItem->update(['quantity' => $request->quantity]);
            $cartItem->load('product.category');

            return response()->json([
                'success' => true,
                'data' => $cartItem,
                'message' => 'Cart item updated successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update cart item: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove item from cart
     */
    public function destroy(Cart $cartItem)
    {
        // Check if cart item belongs to authenticated user
        if ($cartItem->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $cartItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Item removed from cart successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove item from cart: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clear all items from cart
     */
    public function clear()
    {
        try {
            Cart::where('user_id', Auth::id())->delete();

            return response()->json([
                'success' => true,
                'message' => 'Cart cleared successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear cart: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get cart summary for checkout
     */
    public function summary()
    {
        $cartItems = Cart::with(['product'])
            ->where('user_id', Auth::id())
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Cart is empty'
            ], 400);
        }

        $subtotal = 0;
        $items = [];

        foreach ($cartItems as $item) {
            $price = $item->product->sale_price ?? $item->product->price;
            $itemTotal = $price * $item->quantity;
            $subtotal += $itemTotal;

            $items[] = [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'name' => $item->product->name,
                'price' => $price,
                'quantity' => $item->quantity,
                'total' => $itemTotal,
                'image' => $item->product->featured_image
            ];
        }

        $tax = $subtotal * 0.1; // 10% tax
        $shipping = $subtotal > 500 ? 0 : 50; // Free shipping over $500
        $total = $subtotal + $tax + $shipping;

        return response()->json([
            'success' => true,
            'data' => [
                'items' => $items,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping' => $shipping,
                'total' => $total
            ],
            'message' => 'Cart summary retrieved successfully'
        ]);
    }
}
