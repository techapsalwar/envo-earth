<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str; // Import the Str class

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Generate a random category name
        $name = $this->faker->unique()->words(2, true); // e.g., "voluptatem quia"

        return [
            'name' => ucwords($name), // e.g., "Voluptatem Quia"
            'slug' => Str::slug($name), // e.g., "voluptatem-quia"
            'description' => $this->faker->sentence(15), // A fake sentence
        ];
    }
}