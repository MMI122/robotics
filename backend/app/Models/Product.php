<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'short_description',
        'sku',
        'price',
        'sale_price',
        'stock_quantity',
        'manage_stock',
        'in_stock',
        'images',
        'featured_image',
        'weight',
        'dimensions',
        'category_id',
        'specifications',
        'views',
        'is_featured',
        'is_active',
        'status',
        'avg_rating',
        'review_count',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'images' => 'array',
            'specifications' => 'array',
            'price' => 'decimal:2',
            'sale_price' => 'decimal:2',
            'weight' => 'decimal:2',
            'avg_rating' => 'decimal:2',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'manage_stock' => 'boolean',
            'in_stock' => 'boolean',
        ];
    }

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function cartItems()
    {
        return $this->hasMany(Cart::class);
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    // Helper methods
    public function getDiscountPercentageAttribute()
    {
        if ($this->sale_price && $this->price > $this->sale_price) {
            return round((($this->price - $this->sale_price) / $this->price) * 100);
        }
        return 0;
    }

    public function getCurrentPriceAttribute()
    {
        return $this->sale_price ?: $this->price;
    }

    public function isOnSaleAttribute()
    {
        return $this->sale_price && $this->sale_price < $this->price;
    }
}
