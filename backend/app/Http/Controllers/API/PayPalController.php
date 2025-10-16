<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\PayPalService;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Exception;

class PayPalController extends Controller
{
    private $paypalService;

    public function __construct(PayPalService $paypalService)
    {
        $this->paypalService = $paypalService;
    }

    /**
     * Create PayPal payment
     */
    public function createPayment(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
        ]);

        try {
            $order = Order::findOrFail($request->order_id);
            
            // Check if order belongs to authenticated user
            if ($order->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to order'
                ], 403);
            }

            // Check if order is already paid
            if ($order->payment_status === 'paid') {
                return response()->json([
                    'success' => false,
                    'message' => 'Order is already paid'
                ], 400);
            }

            $paypalData = [
                'order_id' => $order->order_number,
                'amount' => $order->total_amount,
                'description' => "RoboticsShop Order #{$order->order_number}"
            ];

            $result = $this->paypalService->createOrder($paypalData);

            if ($result['success']) {
                // Update order with PayPal order ID
                $order->update([
                    'payment_id' => $result['order_id'],
                    'payment_method' => 'paypal',
                    'payment_status' => 'pending'
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'PayPal payment created successfully',
                    'data' => [
                        'paypal_order_id' => $result['order_id'],
                        'approval_url' => $result['approval_url']
                    ]
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to create PayPal payment',
                    'error' => $result['message']
                ], 500);
            }
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while creating PayPal payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Capture PayPal payment
     */
    public function capturePayment(Request $request)
    {
        $request->validate([
            'paypal_order_id' => 'required|string',
            'order_id' => 'required|exists:orders,id',
        ]);

        try {
            $order = Order::findOrFail($request->order_id);
            
            // Check if order belongs to authenticated user
            if ($order->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to order'
                ], 403);
            }

            $result = $this->paypalService->captureOrder($request->paypal_order_id);

            if ($result['success']) {
                // Update order status
                $order->update([
                    'payment_status' => 'paid',
                    'status' => 'processing',
                    'payment_id' => $result['capture_id']
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Payment captured successfully',
                    'data' => [
                        'capture_id' => $result['capture_id'],
                        'status' => $result['status'],
                        'order' => $order->fresh()
                    ]
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to capture payment',
                    'error' => $result['message']
                ], 500);
            }
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while capturing payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle PayPal success redirect
     */
    public function success(Request $request)
    {
        $paypalOrderId = $request->query('token');
        $payerId = $request->query('PayerID');

        if ($paypalOrderId && $payerId) {
            // Redirect to frontend with success parameters
            $frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173'));
            return redirect("{$frontendUrl}/checkout/success?paypal_order_id={$paypalOrderId}&payer_id={$payerId}");
        }

        // Redirect to frontend with error
        $frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173'));
        return redirect("{$frontendUrl}/checkout/error?message=Invalid payment parameters");
    }

    /**
     * Handle PayPal cancel redirect
     */
    public function cancel(Request $request)
    {
        $paypalOrderId = $request->query('token');

        // Redirect to frontend with cancel status
        $frontendUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173'));
        return redirect("{$frontendUrl}/checkout/cancel?paypal_order_id={$paypalOrderId}");
    }

    /**
     * Handle PayPal webhook
     */
    public function webhook(Request $request)
    {
        try {
            $headers = $request->headers->all();
            $body = $request->getContent();

            // Verify webhook signature
            if (!$this->paypalService->verifyWebhook($headers, $body)) {
                return response()->json(['error' => 'Invalid webhook signature'], 400);
            }

            $data = json_decode($body, true);
            
            // Handle different webhook events
            switch ($data['event_type']) {
                case 'PAYMENT.CAPTURE.COMPLETED':
                    $this->handlePaymentCaptured($data);
                    break;
                case 'PAYMENT.CAPTURE.DENIED':
                    $this->handlePaymentDenied($data);
                    break;
                default:
                    // Log unknown event
                    \Log::info('Unknown PayPal webhook event', ['event' => $data['event_type']]);
            }

            return response()->json(['status' => 'success']);
        } catch (Exception $e) {
            \Log::error('PayPal webhook error', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Webhook processing failed'], 500);
        }
    }

    /**
     * Handle payment captured webhook
     */
    private function handlePaymentCaptured($data)
    {
        $customId = $data['resource']['custom_id'] ?? null;
        
        if ($customId) {
            $order = Order::where('order_number', $customId)->first();
            
            if ($order && $order->payment_status !== 'paid') {
                $order->update([
                    'payment_status' => 'paid',
                    'status' => 'processing'
                ]);
                
                \Log::info('PayPal payment captured', ['order_id' => $order->id]);
            }
        }
    }

    /**
     * Handle payment denied webhook
     */
    private function handlePaymentDenied($data)
    {
        $customId = $data['resource']['custom_id'] ?? null;
        
        if ($customId) {
            $order = Order::where('order_number', $customId)->first();
            
            if ($order) {
                $order->update([
                    'payment_status' => 'failed',
                    'status' => 'cancelled'
                ]);
                
                \Log::info('PayPal payment denied', ['order_id' => $order->id]);
            }
        }
    }
}