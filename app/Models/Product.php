<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'category_id',
        'description',
        'price',
        'sale_price',
        'stock_quantity',
        'sku',
        'images',
        'is_featured',
        'product_type',
    ];

    /**
     * The attributes that should be cast.
     * This tells Laravel to automatically handle JSON to array conversion.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'images' => 'array',
        'is_featured' => 'boolean',
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
    ];

    /**
     * Boot method to auto-generate slug
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
                
                // Ensure slug is unique
                $originalSlug = $product->slug;
                $counter = 1;
                while (static::where('slug', $product->slug)->exists()) {
                    $product->slug = $originalSlug . '-' . $counter;
                    $counter++;
                }
            }
        });

        static::updating(function ($product) {
            if ($product->isDirty('name') && empty($product->getOriginal('slug'))) {
                $product->slug = Str::slug($product->name);
                
                // Ensure slug is unique
                $originalSlug = $product->slug;
                $counter = 1;
                while (static::where('slug', $product->slug)->where('id', '!=', $product->id)->exists()) {
                    $product->slug = $originalSlug . '-' . $counter;
                    $counter++;
                }
            }
        });
    }

    /**
     * Get the category that owns the Product.
     * This defines the inverse of the one-to-many relationship.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }
}