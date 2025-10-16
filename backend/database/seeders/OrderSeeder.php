<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\Product;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        // Get all customer users
        $customers = User::where('role', 'customer')->get();
        if ($customers->isEmpty()) {
            echo "No customers found. Running UserSeeder first...\n";
            return;
        }
        
        // Get some products
        $products = Product::take(5)->get();
        
        if ($customers->count() > 0 && $products->count() > 0) {
            // Create sample orders for different customers
            for ($i = 1; $i <= 12; $i++) {
                // Rotate between customers
                $customer = $customers->get(($i - 1) % $customers->count());
                
                $orderNumber = 'RB-2024-' . date('md') . str_pad($i + 100, 3, '0', STR_PAD_LEFT);
                
                // Skip if order already exists
                if (Order::where('order_number', $orderNumber)->exists()) {
                    continue;
                }
                
                $subtotal = rand(150, 800);
                $tax = $subtotal * 0.08;
                $shipping = $i % 3 == 0 ? 20 : 15;
                $total = $subtotal + $tax + $shipping;
                
                // Realistic status progression: processing -> shipped -> delivered
                $statuses = ['processing', 'processing', 'shipped', 'delivered'];
                $status = $statuses[array_rand($statuses)];
                
                $order = Order::create([
                    'order_number' => $orderNumber,
                    'user_id' => $customer->id,
                    'status' => $status,
                    'subtotal' => $subtotal,
                    'tax_amount' => $tax,
                    'shipping_amount' => $shipping,
                    'discount_amount' => 0,
                    'total_amount' => $total,
                    'payment_method' => ['stripe', 'paypal', 'cod'][array_rand(['stripe', 'paypal', 'cod'])],
                    'payment_status' => 'paid',
                    'shipping_address' => [
                        'name' => $customer->name,
                        'address' => $customer->address,
                        'city' => $customer->city,
                        'state' => $customer->state,
                        'country' => $customer->country,
                        'postal_code' => $customer->postal_code
                    ],
                    'billing_address' => [
                        'name' => $customer->name,
                        'address' => $customer->address,
                        'city' => $customer->city,
                        'state' => $customer->state,
                        'country' => $customer->country,
                        'postal_code' => $customer->postal_code
                    ],
                    'created_at' => now()->subDays(rand(1, 45)),
                ]);
                
                // Create order items
                $itemCount = rand(1, 3);
                for ($j = 0; $j < $itemCount; $j++) {
                    $product = $products->random();
                    $quantity = rand(1, 3);
                    
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'product_sku' => $product->sku ?? 'SKU-' . $product->id,
                        'product_image' => $product->image,
                        'quantity' => $quantity,
                        'unit_price' => $product->price,
                        'total_price' => $product->price * $quantity,
                    ]);
                }
            }
        }
    }
}