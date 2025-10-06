<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@roboticsshop.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password123'),
            'phone' => '+880123456789',
            'address' => 'House#5, Road#3, Sector#7, Uttara, Dhaka',
            'city' => 'Dhaka',
            'state' => 'Dhaka',
            'country' => 'Bangladesh',
            'postal_code' => '1230',
            'role' => 'admin',
            'is_active' => true,
            'last_login_at' => now(),
        ]);

        // Create Sample Customers
        $customers = [
            [
                'name' => 'Rubayat Rahman',
                'email' => 'rubayat@example.com',
                'password' => Hash::make('password123'),
                'phone' => '+880987654321',
                'address' => 'House#10, Road#5, Gulshan-2, Dhaka',
                'city' => 'Dhaka',
                'state' => 'Dhaka',
                'country' => 'Bangladesh',
                'postal_code' => '1212',
                'role' => 'customer',
            ],
            [
                'name' => 'Ahmed Hassan',
                'email' => 'ahmed@example.com',
                'password' => Hash::make('password123'),
                'phone' => '+880123456788',
                'address' => 'House#25, Road#12, Banani, Dhaka',
                'city' => 'Dhaka',
                'state' => 'Dhaka',
                'country' => 'Bangladesh',
                'postal_code' => '1213',
                'role' => 'customer',
            ],
            [
                'name' => 'Fatima Khan',
                'email' => 'fatima@example.com',
                'password' => Hash::make('password123'),
                'phone' => '+880555123456',
                'address' => 'House#8, Road#18, Dhanmondi, Dhaka',
                'city' => 'Dhaka',
                'state' => 'Dhaka',
                'country' => 'Bangladesh',
                'postal_code' => '1205',
                'role' => 'customer',
            ],
        ];

        foreach ($customers as $customer) {
            $customer['email_verified_at'] = now();
            $customer['is_active'] = true;
            User::create($customer);
        }
    }
}
