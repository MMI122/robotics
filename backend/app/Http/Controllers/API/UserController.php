<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Get all customers for admin panel
     */
    public function adminIndex(Request $request)
    {
        try {
            $customers = User::where('role', 'customer')->with('orders')->get();

            $transformedCustomers = $customers->map(function ($customer) {
                $totalOrders = $customer->orders->count();
                $totalSpent = $customer->orders->sum('total_amount');
                $avgOrderValue = $totalOrders > 0 ? $totalSpent / $totalOrders : 0;
                $lastOrder = $customer->orders->sortByDesc('created_at')->first();

                return [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'phone' => $customer->phone ?? '',
                    'is_active' => $customer->is_active,
                    'is_verified' => $customer->email_verified_at !== null,
                    'tier' => $customer->tier ?? 'bronze',
                    'total_orders' => $totalOrders,
                    'total_spent' => (float) $totalSpent,
                    'avg_order_value' => (float) $avgOrderValue,
                    'last_order_date' => $lastOrder ? $lastOrder->created_at : null,
                    'joined_date' => $customer->created_at,
                    'last_login' => $customer->last_login_at,
                ];
            });

            // Calculate stats
            $totalRevenue = $customers->sum(function ($customer) {
                return $customer->orders->sum('total_amount');
            });
            $vipCustomers = $customers->where('tier', 'vip')->count();

            return response()->json([
                'success' => true,
                'data' => $transformedCustomers,
                'stats' => [
                    'total_customers' => $customers->count(),
                    'active_customers' => $customers->where('is_active', true)->count(),
                    'vip_customers' => $vipCustomers,
                    'total_revenue' => (float) $totalRevenue,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch customers: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single customer details
     */
    public function show(User $user)
    {
        try {
            if ($user->role !== 'customer') {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            $user->load(['orders.orderItems.product']);
            
            $totalSpent = $user->orders()->sum('total_amount');
            $tier = $this->calculateTier($totalSpent);

            $customerData = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'is_active' => $user->is_active,
                'is_verified' => $user->email_verified_at !== null,
                'tier' => $user->tier ?? $tier,
                'total_orders' => $user->orders->count(),
                'total_spent' => $totalSpent,
                'avg_order_value' => $user->orders->count() > 0 ? $totalSpent / $user->orders->count() : 0,
                'joined_date' => $user->created_at,
                'last_login' => $user->last_login_at,
                'address' => [
                    'street' => $user->address,
                    'city' => $user->city,
                    'state' => $user->state,
                    'country' => $user->country,
                    'postal_code' => $user->postal_code,
                ],
                'recent_orders' => $user->orders()->latest()->take(5)->get(),
            ];

            return response()->json([
                'success' => true,
                'data' => $customerData
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch customer: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update customer information
     */
    public function update(Request $request, User $user)
    {
        try {
            if ($user->role !== 'customer') {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $user->id,
                'phone' => 'sometimes|nullable|string|max:20',
                'is_active' => 'sometimes|boolean',
                'address' => 'sometimes|nullable|string',
                'city' => 'sometimes|nullable|string',
                'state' => 'sometimes|nullable|string',
                'country' => 'sometimes|nullable|string',
                'postal_code' => 'sometimes|nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user->update($request->only([
                'name', 'email', 'phone', 'is_active', 
                'address', 'city', 'state', 'country', 'postal_code'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Customer updated successfully',
                'data' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update customer: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update customer tier
     */
    public function updateTier(Request $request, User $user)
    {
        try {
            if ($user->role !== 'customer') {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'tier' => 'required|in:bronze,silver,gold,platinum,vip'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid tier',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user->update(['tier' => $request->tier]);

            return response()->json([
                'success' => true,
                'message' => 'Customer tier updated successfully',
                'data' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update tier: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update customer status (active/inactive)
     */
    public function updateStatus(Request $request, User $user)
    {
        try {
            if ($user->role !== 'customer') {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'is_active' => 'required|boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid status',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user->update(['is_active' => $request->is_active]);

            return response()->json([
                'success' => true,
                'message' => 'Customer status updated successfully',
                'data' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calculate customer tier based on total spent
     */
    private function calculateTier($totalSpent)
    {
        if ($totalSpent >= 2000) return 'platinum';
        if ($totalSpent >= 1000) return 'gold';
        if ($totalSpent >= 500) return 'silver';
        return 'bronze';
    }
}