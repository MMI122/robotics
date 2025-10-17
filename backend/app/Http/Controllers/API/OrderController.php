<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Product;
use App\Jobs\ProcessOrderJob;
use App\Events\OrderCreated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Display user's orders
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $status = $request->get('status');

        $query = Order::with(['orderItems.product'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc');

        if ($status) {
            $query->where('status', $status);
        }

        $orders = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $orders,
            'message' => 'Orders retrieved successfully'
        ]);
    }

    /**
     * Create new order from cart
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'shipping_address' => 'required|array',
            'shipping_address.first_name' => 'required|string|max:255',
            'shipping_address.last_name' => 'required|string|max:255',
            'shipping_address.email' => 'required|email',
            'shipping_address.phone' => 'required|string|max:20',
            'shipping_address.address_line_1' => 'required|string|max:255',
            'shipping_address.address_line_2' => 'nullable|string|max:255',
            'shipping_address.city' => 'required|string|max:255',
            'shipping_address.state' => 'required|string|max:255',
            'shipping_address.postal_code' => 'required|string|max:20',
            'shipping_address.country' => 'required|string|max:255',
            'payment_method' => 'required|in:stripe,card,apple_pay,google_pay,paypal,bkash,nagad,rocket,cod',
            'billing_same_as_shipping' => 'boolean',
            'billing_address' => 'required_if:billing_same_as_shipping,false|array',
            'notes' => 'nullable|string|max:1000'
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

            // Get cart items
            $cartItems = Cart::with(['product'])
                ->where('user_id', Auth::id())
                ->get();

            if ($cartItems->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart is empty'
                ], 400);
            }

            // Calculate totals
            $subtotal = 0;
            foreach ($cartItems as $item) {
                $price = $item->product->sale_price ?? $item->product->price;
                $subtotal += $price * $item->quantity;

                // Check stock
                if ($item->product->stock_quantity < $item->quantity) {
                    throw new \Exception("Insufficient stock for {$item->product->name}");
                }
            }

            $tax = $subtotal * 0.1;
            $shipping = $subtotal > 500 ? 0 : 50;
            $total = $subtotal + $tax + $shipping;

            // Create order
            $order = Order::create([
                'user_id' => Auth::id(),
                'order_number' => 'ORD-' . strtoupper(Str::random(8)),
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => $request->payment_method,
                'subtotal' => $subtotal,
                'tax_amount' => $tax,
                'shipping_amount' => $shipping,
                'total_amount' => $total,
                'shipping_address' => json_encode($request->shipping_address),
                'billing_address' => json_encode(
                    $request->billing_same_as_shipping 
                        ? $request->shipping_address 
                        : $request->billing_address
                ),
                'notes' => $request->notes
            ]);

            // Create order items and update stock
            foreach ($cartItems as $item) {
                $price = $item->product->sale_price ?? $item->product->price;
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'product_sku' => $item->product->sku,
                    'product_image' => $item->product->featured_image,
                    'quantity' => $item->quantity,
                    'unit_price' => $price,
                    'total_price' => $price * $item->quantity
                ]);

                // Update product stock
                $item->product->decrement('stock_quantity', $item->quantity);
                
                // Update stock status if needed
                if ($item->product->stock_quantity <= 0) {
                    $item->product->update(['in_stock' => false]);
                }
            }

            // Clear cart
            Cart::where('user_id', Auth::id())->delete();

            DB::commit();

            // Dispatch job for order processing
            ProcessOrderJob::dispatch($order);

            // Fire order created event
            event(new OrderCreated($order));

            // Load order with items for response
            $order->load('orderItems.product');

            return response()->json([
                'success' => true,
                'data' => $order,
                'message' => 'Order created successfully'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified order
     */
    public function show(Order $order)
    {
        // Check if order belongs to authenticated user
        if ($order->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        $order->load(['orderItems.product', 'user']);

        return response()->json([
            'success' => true,
            'data' => $order,
            'message' => 'Order retrieved successfully'
        ]);
    }

    /**
     * Cancel an order
     */
    public function cancel(Order $order)
    {
        // Check if order belongs to authenticated user
        if ($order->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        // Check if order can be cancelled
        if (!in_array($order->status, ['pending', 'confirmed'])) {
            return response()->json([
                'success' => false,
                'message' => 'Order cannot be cancelled'
            ], 400);
        }

        try {
            DB::beginTransaction();

            // Update order status
            $order->update([
                'status' => 'cancelled',
                'cancelled_at' => now()
            ]);

            // Restore product stock
            foreach ($order->orderItems as $item) {
                $item->product->increment('stock_quantity', $item->quantity);
                $item->product->update(['in_stock' => true]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $order,
                'message' => 'Order cancelled successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Track order status
     */
    public function track(string $orderNumber)
    {
        $order = Order::with(['orderItems.product'])
            ->where('order_number', $orderNumber)
            ->where('user_id', Auth::id())
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        // Order tracking timeline
        $timeline = [
            [
                'status' => 'pending',
                'label' => 'Order Placed',
                'completed' => true,
                'date' => $order->created_at
            ],
            [
                'status' => 'confirmed',
                'label' => 'Order Confirmed',
                'completed' => in_array($order->status, ['confirmed', 'processing', 'shipped', 'delivered']),
                'date' => $order->confirmed_at
            ],
            [
                'status' => 'processing',
                'label' => 'Processing',
                'completed' => in_array($order->status, ['processing', 'shipped', 'delivered']),
                'date' => $order->processing_at
            ],
            [
                'status' => 'shipped',
                'label' => 'Shipped',
                'completed' => in_array($order->status, ['shipped', 'delivered']),
                'date' => $order->shipped_at
            ],
            [
                'status' => 'delivered',
                'label' => 'Delivered',
                'completed' => $order->status === 'delivered',
                'date' => $order->delivered_at
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'order' => $order,
                'timeline' => $timeline
            ],
            'message' => 'Order tracking retrieved successfully'
        ]);
    }

    /**
     * Get order statistics for user
     */
    public function statistics()
    {
        $userId = Auth::id();
        
        $stats = [
            'total_orders' => Order::where('user_id', $userId)->count(),
            'pending_orders' => Order::where('user_id', $userId)->where('status', 'pending')->count(),
            'completed_orders' => Order::where('user_id', $userId)->where('status', 'delivered')->count(),
            'cancelled_orders' => Order::where('user_id', $userId)->where('status', 'cancelled')->count(),
            'total_spent' => Order::where('user_id', $userId)
                ->where('status', '!=', 'cancelled')
                ->sum('total_amount')
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
            'message' => 'Order statistics retrieved successfully'
        ]);
    }

    /**
     * Display all orders for admin
     */
    public function adminIndex(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);
            $status = $request->get('status');

            $query = Order::with(['user', 'orderItems.product'])
                ->orderBy('created_at', 'desc');

            if ($status) {
                $query->where('status', $status);
            }

            $orders = $query->paginate($perPage);

            // Transform the data to match frontend expectations
            $transformedOrders = $orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'user_id' => $order->user_id,
                    'user_name' => $order->user->name ?? 'Unknown',
                    'user_email' => $order->user->email ?? 'unknown@email.com',
                    'status' => $this->transformStatus($order->status),
                    'total_amount' => (float) $order->total_amount,
                    'payment_method' => $this->transformPaymentMethod($order->payment_method),
                    'payment_status' => $this->transformPaymentStatus($order->payment_status),
                    'shipping_address' => $this->formatShippingAddress($order->shipping_address),
                    'created_at' => $order->created_at,
                    'updated_at' => $order->updated_at,
                    'items' => $order->orderItems->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'product_id' => $item->product_id,
                            'product_name' => $item->product->name ?? 'Unknown Product',
                            'product_image' => $item->product->image_url ?? '/api/placeholder/60/60',
                            'quantity' => $item->quantity,
                            'price' => (float) $item->price,
                        ];
                    })
                ];
            });

            // Update pagination data
            $paginationData = $orders->toArray();
            $paginationData['data'] = $transformedOrders;

            return response()->json([
                'success' => true,
                'data' => $paginationData,
                'message' => 'Orders retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update order status (Admin only)
     */
    public function updateStatus(Request $request, Order $order)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $order->update([
            'status' => $request->status
        ]);

        return response()->json([
            'success' => true,
            'data' => $order->load(['user', 'orderItems.product']),
            'message' => 'Order status updated successfully'
        ]);
    }

    /**
     * Transform status from database to frontend format
     */
    private function transformStatus($status)
    {
        // Return status as-is since frontend expects the actual database values
        return $status;
    }

    /**
     * Transform payment method from database to frontend format
     */
    private function transformPaymentMethod($paymentMethod)
    {
        $methodMap = [
            'cod' => 'bank_transfer',
            'stripe' => 'credit_card',
            'paypal' => 'paypal'
        ];

        return $methodMap[$paymentMethod] ?? $paymentMethod;
    }

    /**
     * Transform payment status from database to frontend format
     */
    private function transformPaymentStatus($paymentStatus)
    {
        $statusMap = [
            'paid' => 'completed',
            'pending' => 'pending',
            'failed' => 'failed'
        ];

        return $statusMap[$paymentStatus] ?? $paymentStatus;
    }

    /**
     * Format shipping address from object to string
     */
    private function formatShippingAddress($shippingAddress)
    {
        if (is_string($shippingAddress)) {
            return $shippingAddress;
        }

        if (is_array($shippingAddress) || is_object($shippingAddress)) {
            $address = (array) $shippingAddress;
            $parts = [];
            
            if (!empty($address['address'])) $parts[] = $address['address'];
            if (!empty($address['city'])) $parts[] = $address['city'];
            if (!empty($address['state'])) $parts[] = $address['state'];
            if (!empty($address['country'])) $parts[] = $address['country'];
            if (!empty($address['postal_code'])) $parts[] = $address['postal_code'];
            
            return implode(', ', $parts);
        }

        return 'N/A';
    }

    /**
     * Generate and download invoice for an order
     */
    public function downloadInvoice($orderNumber)
    {
        try {
            // Find order by order number for the authenticated user
            $order = Order::with(['orderItems.product', 'user'])
                ->where('order_number', $orderNumber)
                ->where('user_id', Auth::id())
                ->first();

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found'
                ], 404);
            }

            // Generate simple HTML invoice
            $html = $this->generateInvoiceHTML($order);

            // For now, return HTML as text. In production, you'd use a PDF library like DomPDF
            return response($html)
                ->header('Content-Type', 'text/html')
                ->header('Content-Disposition', 'attachment; filename="invoice-' . $orderNumber . '.html"');

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate invoice: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate invoice HTML
     */
    private function generateInvoiceHTML($order)
    {
        $shippingAddress = json_decode($order->shipping_address, true);
        
        $html = '
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice - ' . $order->order_number . '</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .order-info { margin-bottom: 20px; }
                .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .table th { background-color: #f2f2f2; }
                .totals { text-align: right; }
                .total-row { font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>RoboticsShop</h1>
                <h2>INVOICE</h2>
            </div>
            
            <div class="order-info">
                <p><strong>Order Number:</strong> ' . $order->order_number . '</p>
                <p><strong>Order Date:</strong> ' . $order->created_at->format('F j, Y') . '</p>
                <p><strong>Customer:</strong> ' . $order->user->name . '</p>
                <p><strong>Email:</strong> ' . $order->user->email . '</p>
                <p><strong>Payment Method:</strong> ' . ucfirst($order->payment_method) . '</p>
            </div>

            <div class="shipping-address">
                <h3>Shipping Address</h3>
                <p>' . ($shippingAddress['first_name'] ?? '') . ' ' . ($shippingAddress['last_name'] ?? '') . '</p>
                <p>' . ($shippingAddress['address_line_1'] ?? '') . '</p>
                <p>' . ($shippingAddress['city'] ?? '') . ', ' . ($shippingAddress['state'] ?? '') . ' ' . ($shippingAddress['postal_code'] ?? '') . '</p>
                <p>' . ($shippingAddress['country'] ?? '') . '</p>
            </div>

            <table class="table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>';

        foreach ($order->orderItems as $item) {
            $html .= '
                    <tr>
                        <td>' . $item->product_name . '</td>
                        <td>' . $item->product_sku . '</td>
                        <td>' . $item->quantity . '</td>
                        <td>$' . number_format($item->unit_price, 2) . '</td>
                        <td>$' . number_format($item->total_price, 2) . '</td>
                    </tr>';
        }

        $html .= '
                </tbody>
            </table>

            <div class="totals">
                <p>Subtotal: $' . number_format($order->subtotal, 2) . '</p>
                <p>Shipping: $' . number_format($order->shipping_amount, 2) . '</p>
                <p>Tax: $' . number_format($order->tax_amount, 2) . '</p>
                <p class="total-row">Total: $' . number_format($order->total_amount, 2) . '</p>
            </div>

            <div style="margin-top: 40px; text-align: center; color: #666;">
                <p>Thank you for your business!</p>
                <p>RoboticsShop - Your Electronics Partner</p>
            </div>
        </body>
        </html>';

        return $html;
    }
}
