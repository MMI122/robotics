<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ContactController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\CartController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\WishlistController;
use App\Http\Controllers\API\SupportController;
use App\Http\Controllers\API\PayPalController;
use App\Http\Controllers\API\UserController;

// Public routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('reset-password', [AuthController::class, 'resetPassword']);

// Public product routes
Route::get('products', [ProductController::class, 'index']);
Route::get('products/featured', [ProductController::class, 'featured']);
Route::get('products/search', [ProductController::class, 'search']);
Route::get('products/{slug}', [ProductController::class, 'show']);
Route::get('products/{product}/recommendations', [ProductController::class, 'recommendations']);

// Public category routes
Route::get('categories', [CategoryController::class, 'index']);
Route::get('categories/tree', [CategoryController::class, 'tree']);
Route::get('categories/{slug}', [CategoryController::class, 'show']);
Route::get('categories/{slug}/products', [CategoryController::class, 'products']);

// Public review routes
Route::get('products/{product}/reviews', [ReviewController::class, 'index']);
Route::get('reviews/{review}', [ReviewController::class, 'show']);
Route::post('reviews/{review}/helpful', [ReviewController::class, 'markHelpful']);

// Public contact route
Route::post('contact', [ContactController::class, 'store']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('user', [AuthController::class, 'user']);
    Route::put('user', [AuthController::class, 'updateProfile']);
    Route::put('user/password', [AuthController::class, 'updatePassword']);
    Route::delete('user', [AuthController::class, 'deleteAccount']);
    
    // Cart routes
    Route::get('cart', [CartController::class, 'index']);
    Route::post('cart', [CartController::class, 'store']);
    Route::put('cart/{cartItem}', [CartController::class, 'update']);
    Route::delete('cart/{cartItem}', [CartController::class, 'destroy']);
    Route::delete('cart', [CartController::class, 'clear']);
    Route::get('cart/summary', [CartController::class, 'summary']);
    
    // Order routes
    Route::get('orders', [OrderController::class, 'index']);
    Route::post('orders', [OrderController::class, 'store']);
    Route::get('orders/{order}', [OrderController::class, 'show']);
    Route::put('orders/{order}/cancel', [OrderController::class, 'cancel']);
    Route::get('orders/{order}/invoice', [OrderController::class, 'downloadInvoice']);
    Route::get('orders/track/{orderNumber}', [OrderController::class, 'track']);
    Route::get('orders/statistics', [OrderController::class, 'statistics']);
    
    // Wishlist routes
    Route::get('wishlist', [WishlistController::class, 'index']);
    Route::post('wishlist', [WishlistController::class, 'store']);
    Route::delete('wishlist', [WishlistController::class, 'destroy']);
    Route::delete('wishlist/{wishlistItem}', [WishlistController::class, 'remove']);
    Route::delete('wishlist/clear', [WishlistController::class, 'clear']);
    Route::post('wishlist/check', [WishlistController::class, 'check']);
    Route::get('wishlist/count', [WishlistController::class, 'count']);
    Route::post('wishlist/move-to-cart', [WishlistController::class, 'moveToCart']);
    
    // Review routes
    Route::post('products/{product}/reviews', [ReviewController::class, 'store']);
    Route::put('reviews/{review}', [ReviewController::class, 'update']);
    Route::delete('reviews/{review}', [ReviewController::class, 'destroy']);
    Route::get('user/reviews', [ReviewController::class, 'userReviews']);
    
    // PayPal routes
    Route::post('paypal/create-payment', [PayPalController::class, 'createPayment']);
    Route::post('paypal/capture-payment', [PayPalController::class, 'capturePayment']);
    
    // Support routes
    Route::get('support', [SupportController::class, 'index']);
    Route::post('support', [SupportController::class, 'store']);
    Route::get('support/{support}', [SupportController::class, 'show']);
    Route::put('support/{support}', [SupportController::class, 'update']);
});

// Public endpoints for debugging
Route::get('admin/analytics/dashboard', function () {
    try {
        $totalProducts = \App\Models\Product::count();
        $totalOrders = \App\Models\Order::count();
        $totalUsers = \App\Models\User::where('role', 'customer')->count();
        $totalRevenue = \App\Models\Order::where('status', '!=', 'cancelled')
            ->whereNotNull('total_amount')
            ->sum('total_amount');

        return response()->json([
            'success' => true,
            'message' => 'Admin dashboard analytics retrieved successfully',
            'data' => [
                'total_products' => $totalProducts,
                'total_orders' => $totalOrders,
                'total_users' => $totalUsers,
                'total_revenue' => $totalRevenue ?: 0
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error fetching dashboard analytics',
            'error' => $e->getMessage()
        ], 500);
    }
});

// Test admin endpoints (temporary - no auth required)
Route::get('admin/orders', [OrderController::class, 'adminIndex']);
Route::get('admin/products', [ProductController::class, 'adminIndex']);
Route::get('admin/customers', [UserController::class, 'adminIndex']);

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Product management
    Route::post('products', [ProductController::class, 'store']);
    Route::put('products/{product}', [ProductController::class, 'update']);
    Route::delete('products/{product}', [ProductController::class, 'destroy']);
    Route::post('products/{product}/images', [ProductController::class, 'uploadImages']);
    
    // Category management
    Route::post('categories', [CategoryController::class, 'store']);
    Route::put('categories/{category}', [CategoryController::class, 'update']);
    Route::delete('categories/{category}', [CategoryController::class, 'destroy']);
    
    // Order management
    Route::put('orders/{order}/status', [OrderController::class, 'updateStatus']);
    Route::get('orders/analytics', [OrderController::class, 'analytics']);
    
    // Review management
    Route::get('reviews', [ReviewController::class, 'adminIndex']);
    Route::put('reviews/{review}/approve', [ReviewController::class, 'approve']);
    Route::put('reviews/{review}/reject', [ReviewController::class, 'reject']);
    
    // Support management
    Route::get('support', [SupportController::class, 'adminIndex']);
    Route::put('support/{support}/reply', [SupportController::class, 'adminReply']);
    Route::put('support/{support}/status', [SupportController::class, 'updateStatus']);
    
    // Customer management
    Route::get('customers', [UserController::class, 'adminIndex']);
    Route::get('customers/{user}', [UserController::class, 'show']);
    Route::put('customers/{user}', [UserController::class, 'update']);
    Route::put('customers/{user}/tier', [UserController::class, 'updateTier']);
    Route::put('customers/{user}/status', [UserController::class, 'updateStatus']);
});

// Public PayPal routes (for redirects and webhooks)
Route::get('paypal/success', [PayPalController::class, 'success']);
Route::get('paypal/cancel', [PayPalController::class, 'cancel']);
Route::post('paypal/webhook', [PayPalController::class, 'webhook']);

// Health check
Route::get('health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'service' => 'RoboticsShop API',
        'version' => '1.0.0'
    ]);
});

// Debug mail config (temporary)
Route::get('debug/mail', function () {
    return response()->json([
        'mail_default' => config('mail.default'),
        'smtp_host' => config('mail.mailers.smtp.host'),
        'smtp_port' => config('mail.mailers.smtp.port'),
        'smtp_username' => config('mail.mailers.smtp.username'),
        'smtp_password_set' => !empty(config('mail.mailers.smtp.password')),
        'from_address' => config('mail.from.address'),
        'from_name' => config('mail.from.name'),
        'app_env' => config('app.env'),
    ]);
});