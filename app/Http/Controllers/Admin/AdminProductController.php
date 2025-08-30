<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminProductController extends Controller
{
    public function index(Request $request)
    {

        $query = Product::with('category');


        // Search functionality
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }



        // Category filter
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }



        $products = $query->latest()->paginate(10)->withQueryString();

        // Get categories for filter dropdown
        $categories = Category::select('id', 'name')->get();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => $categories,

            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function create()
    {

        $categories = Category::select('id', 'name')->get();

        return Inertia::render('Admin/Products/Create', [

            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',



            'sale_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'sku' => 'nullable|string|unique:products,sku',
            'product_type' => 'required|string',
            'is_featured' => 'boolean',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);


        $data = $request->all();
        // Ensure unique slug by appending a number if needed
        $baseSlug = Str::slug($request->name);
        $slug = $baseSlug;
        $counter = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }
        $data['slug'] = $slug;
        $data['is_featured'] = $request->boolean('is_featured');

        // Handle image uploads
        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');

                $imagePaths[] = $path;
            }
            $data['images'] = json_encode($imagePaths);
        }









        Product::create($data);


        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit($id)
    {
        $product = Product::with('category')->findOrFail($id);
        $categories = Category::select('id', 'name')->get();
        // Ensure product fields are not null for the form
        $product->name = $product->name ?? '';
        $product->category_id = $product->category_id ?? '';
        $product->description = $product->description ?? '';
        $product->price = $product->price ?? '';
        $product->sale_price = $product->sale_price ?? '';
        $product->stock_quantity = $product->stock_quantity ?? 0;
        $product->sku = $product->sku ?? '';
        $product->product_type = $product->product_type ?? '';
        $product->is_featured = $product->is_featured ?? false;
        $product->images = $product->images ?? [];
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'sku' => 'nullable|string|unique:products,sku,' . $product->id,
            'product_type' => 'required|string|max:255',
            'is_featured' => 'boolean',
            // Accept file uploads named either `images` (used by the admin form)
            // or `new_images` (legacy) so production edits always work.
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'new_images' => 'nullable|array',
            'new_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'existing_images' => 'nullable|string',
            'images_to_delete' => 'nullable|string',
        ]);
        $product->name = $request->input('name');
        $product->category_id = $request->input('category_id');
        $product->description = $request->input('description');
        $product->price = $request->input('price');
        $product->sale_price = $request->input('sale_price');
        $product->stock_quantity = $request->input('stock_quantity');
        $product->sku = $request->input('sku');
        $product->product_type = $request->input('product_type');
        $product->is_featured = $request->boolean('is_featured');

        // Handle image uploads. Accept files from either `images` or `new_images`.
        $uploadedFiles = $request->file('images') ?? $request->file('new_images');
        if ($uploadedFiles && is_array($uploadedFiles) && count($uploadedFiles) > 0) {
            // Delete old images (if any) - we'll replace with the new set
            if ($product->images) {
                $oldImages = is_string($product->images) ? json_decode($product->images, true) : $product->images;
                if (is_array($oldImages)) {
                    foreach ($oldImages as $oldImage) {
                        Storage::disk('public')->delete($oldImage);
                    }
                }
            }

            $imagePaths = [];
            foreach ($uploadedFiles as $file) {
                // store under `products` on the public disk so files end up in
                // storage/app/public/products which should be exposed at
                // public_html/storage/products via the storage symlink in production
                $path = $file->store('products', 'public');
                $imagePaths[] = $path;
            }

            $product->images = json_encode($imagePaths);
        }

        $product->save();

        return redirect()->route('admin.products.index')
                         ->with('success', 'Product updated successfully.');
     }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        // Delete associated images
        if ($product->images) {
            $images = json_decode($product->images, true);
            if (is_array($images)) {
                foreach ($images as $image) {
                    Storage::disk('public')->delete($image);
                }
            }
        }
        $product->delete();
        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    public function show($id)
    {
        $product = Product::with('category')->findOrFail($id);
        return Inertia::render('Admin/Products/Show', [
            'product' => $product,
        ]);
    }
}