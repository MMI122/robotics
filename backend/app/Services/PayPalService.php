<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PayPalService
{
    private $clientId;
    private $clientSecret;
    private $baseUrl;
    private $mode;

    public function __construct()
    {
        $this->clientId = config('paypal.client_id');
        $this->clientSecret = config('paypal.client_secret');
        $this->mode = config('paypal.mode', 'sandbox');
        
        $this->baseUrl = $this->mode === 'live' 
            ? 'https://api-m.paypal.com' 
            : 'https://api-m.sandbox.paypal.com';
    }

    /**
     * Get access token from PayPal
     */
    private function getAccessToken()
    {
        try {
            $response = Http::withBasicAuth($this->clientId, $this->clientSecret)
                ->asForm()
                ->post("{$this->baseUrl}/v1/oauth2/token", [
                    'grant_type' => 'client_credentials'
                ]);

            if ($response->successful()) {
                return $response->json()['access_token'];
            }

            throw new Exception('Failed to get PayPal access token: ' . $response->body());
        } catch (Exception $e) {
            Log::error('PayPal access token error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Create PayPal order
     */
    public function createOrder($orderData)
    {
        try {
            $accessToken = $this->getAccessToken();

            $requestBody = [
                'intent' => 'CAPTURE',
                'purchase_units' => [
                    [
                        'reference_id' => $orderData['order_id'],
                        'amount' => [
                            'currency_code' => config('paypal.currency', 'USD'),
                            'value' => number_format($orderData['amount'], 2, '.', '')
                        ],
                        'description' => $orderData['description'] ?? 'RoboticsShop Order',
                        'custom_id' => $orderData['order_id']
                    ]
                ],
                'application_context' => [
                    'return_url' => config('paypal.return_url'),
                    'cancel_url' => config('paypal.cancel_url'),
                    'brand_name' => config('app.name'),
                    'locale' => 'en-US',
                    'landing_page' => 'BILLING',
                    'shipping_preference' => 'SET_PROVIDED_ADDRESS',
                    'user_action' => 'PAY_NOW'
                ]
            ];

            $response = Http::withToken($accessToken)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'PayPal-Request-Id' => uniqid(),
                ])
                ->post("{$this->baseUrl}/v2/checkout/orders", $requestBody);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => true,
                    'order_id' => $data['id'],
                    'approval_url' => $this->getApprovalUrl($data['links']),
                    'data' => $data
                ];
            } else {
                throw new Exception('PayPal API Error: ' . $response->body());
            }
        } catch (Exception $e) {
            Log::error('PayPal create order error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage(),
                'error' => $e
            ];
        }
    }

    /**
     * Capture PayPal order
     */
    public function captureOrder($paypalOrderId)
    {
        try {
            $accessToken = $this->getAccessToken();

            $response = Http::withToken($accessToken)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'PayPal-Request-Id' => uniqid(),
                ])
                ->post("{$this->baseUrl}/v2/checkout/orders/{$paypalOrderId}/capture");

            if ($response->successful()) {
                $data = $response->json();
                $captureId = $data['purchase_units'][0]['payments']['captures'][0]['id'] ?? null;
                
                return [
                    'success' => true,
                    'capture_id' => $captureId,
                    'status' => $data['status'],
                    'data' => $data
                ];
            } else {
                throw new Exception('PayPal capture error: ' . $response->body());
            }
        } catch (Exception $e) {
            Log::error('PayPal capture order error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage(),
                'error' => $e
            ];
        }
    }

    /**
     * Get order details
     */
    public function getOrder($paypalOrderId)
    {
        try {
            $accessToken = $this->getAccessToken();

            $response = Http::withToken($accessToken)
                ->get("{$this->baseUrl}/v2/checkout/orders/{$paypalOrderId}");

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json()
                ];
            } else {
                throw new Exception('PayPal get order error: ' . $response->body());
            }
        } catch (Exception $e) {
            Log::error('PayPal get order error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage(),
                'error' => $e
            ];
        }
    }

    /**
     * Extract approval URL from links
     */
    private function getApprovalUrl($links)
    {
        foreach ($links as $link) {
            if ($link['rel'] === 'approve') {
                return $link['href'];
            }
        }
        return null;
    }

    /**
     * Verify webhook signature
     */
    public function verifyWebhook($headers, $body)
    {
        // For now, return true. In production, implement proper verification
        // using PayPal's webhook verification process
        return true;
    }
}