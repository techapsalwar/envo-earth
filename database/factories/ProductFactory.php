<?php

namespace Database\Factories;

use App\Models\Category; // Import the Category model
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str; // Import the Str class

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->words(3, true);
        $productTypes = ['terracotta-art', 'terracotta-planter', 'terracotta-utensil', 'plant', '3d-design'];

        return [
            'name' => ucwords($name),
            'slug' => Str::slug($name),
            // We will assign a random, existing category ID
            'category_id' => Category::inRandomOrder()->first()->id,
            'description' => $this->faker->paragraph(5),
            'price' => $this->faker->randomFloat(2, 10, 200), // 2 decimals, min 10, max 200
            'stock_quantity' => $this->faker->numberBetween(0, 100),
            'is_featured' => $this->faker->boolean(25), // 25% chance of being true
            'product_type' => $this->faker->randomElement($productTypes),
            'images' => json_encode([
                'images/placeholder.jpg', // A default placeholder image
            ]),
        ];
    }
}