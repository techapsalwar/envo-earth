<?php

namespace Database\Seeders;

use App\Models\Category; // Import Category
use App\Models\Product;  // Import Product
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // First, create 5 parent categories using our factory
        Category::factory(5)->create();

        // Now, create 30 products. The factory will automatically
        // assign them to one of the 5 categories we just created.
        Product::factory(30)->create();
    }
}