<?php

return [
    /*
    |--------------------------------------------------------------------------
    | PayPal Configuration
    |--------------------------------------------------------------------------
    |
    | PayPal API configuration for the application
    |
    */

    'client_id' => env('PAYPAL_CLIENT_ID'),
    'client_secret' => env('PAYPAL_CLIENT_SECRET'),
    'mode' => env('PAYPAL_MODE', 'sandbox'), // sandbox or live
    'webhook_id' => env('PAYPAL_WEBHOOK_ID'),
    
    'sandbox' => [
        'base_uri' => 'https://api-m.sandbox.paypal.com',
    ],
    
    'live' => [
        'base_uri' => 'https://api-m.paypal.com',
    ],
    
    // Currency settings
    'currency' => 'USD',
    
    // Return URLs
    'return_url' => env('APP_URL') . '/api/paypal/success',
    'cancel_url' => env('APP_URL') . '/api/paypal/cancel',
    
    // Webhook settings
    'webhook_url' => env('APP_URL') . '/api/paypal/webhook',
];