<?php

namespace App\Http\Controllers;

use App\Models\Category; // Import Category model
use Illuminate\Http\Request;
use Inertia\Inertia; // Import Inertia

class CategoryController extends Controller
{
    /**
     * Display the specified category and its products.
     */
    public function show(Category $category)
    {
        // Use Route-Model binding to automatically find the category by its slug.
        // The '$category' variable is now the specific category model instance.

        // Now, get the products that belong to THIS category.
        // We use the 'products()' relationship we defined in the Category model.
        $products = $category->products()
            ->latest()
            ->paginate(12);

        // Return the Inertia view, passing both the category and its products
        return Inertia::render('Categories/Show', [
            'category' => $category,
            'products' => $products,
        ]);
    }
}