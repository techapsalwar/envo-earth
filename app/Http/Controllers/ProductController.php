<?php

namespace App\Http\Controllers;

use App\Models\Product; // Import the Product model
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia; // Import Inertia

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Allow filtering by category via query param: numeric category id or slug/name
        $categoryParam = $request->query('category');

        $query = Product::query()->with('category')->latest();
        $categoryName = null;

        if ($categoryParam) {
            // Try to resolve by numeric id first
            if (is_numeric($categoryParam)) {
                $cat = Category::find((int) $categoryParam);
                if ($cat) {
                    $query->where('category_id', $cat->id);
                    $categoryName = $cat->name;
                }
            } else {
                // Try to resolve by slug or name
                $cat = Category::where('slug', $categoryParam)
                    ->orWhere('name', $categoryParam)
                    ->first();

                if ($cat) {
                    $query->where('category_id', $cat->id);
                    $categoryName = $cat->name;
                }
            }
        }

        // Paginate and preserve query string for pagination links
        $products = $query->paginate(12)->withQueryString();

        // Return the Inertia view, passing the products data and active filters
        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => [
                'category' => $categoryParam,
                'category_name' => $categoryName,
            ],
        ]);
    }

    public function show(Product $product)
    {
        // The 'product' variable is automatically fetched by Laravel
        // through a feature called "Route Model Binding".
        // Load the category relationship
        $product->load('category');

        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }
}