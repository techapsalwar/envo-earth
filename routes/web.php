<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;

use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;


use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminOrderController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Product;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'products' => Product::latest()->select('id', 'name', 'price', 'images', 'slug')->take(8)->get(),
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [ProfileController::class, 'dashboard'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


// Public routes
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');

// Cart routes
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
Route::post('/cart/update', [CartController::class, 'update'])->name('cart.update');
Route::post('/cart/remove', [CartController::class, 'remove'])->name('cart.remove');

Route::post('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');

// Checkout routes
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

// Cart API route for cart count (for CartBadge)
Route::get('/cart-count', [App\Http\Controllers\CartController::class, 'cartCount']);







// Admin routes
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {


    Route::get('/', [AdminController::class, 'index'])->name('admin.dashboard');
    
    // Users management
    Route::get('/users', [AdminUserController::class, 'index'])->name('admin.users.index');
    Route::get('/users/create', [AdminUserController::class, 'create'])->name('admin.users.create');
    Route::post('/users', [AdminUserController::class, 'store'])->name('admin.users.store');
    Route::get('/users/{user}/edit', [AdminUserController::class, 'edit'])->name('admin.users.edit');
    Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('admin.users.update');
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('admin.users.destroy');
    
    // Products management
    Route::get('/products', [AdminProductController::class, 'index'])->name('admin.products.index');
    Route::get('/products/create', [AdminProductController::class, 'create'])->name('admin.products.create');
    Route::post('/products', [AdminProductController::class, 'store'])->name('admin.products.store');
    Route::get('/products/{id}/edit', [AdminProductController::class, 'edit'])->name('admin.products.edit');
    Route::put('/products/{id}', [AdminProductController::class, 'update'])->name('admin.products.update');
    Route::delete('/products/{id}', [AdminProductController::class, 'destroy'])->name('admin.products.destroy');
    // Add a show route for viewing a single product in admin
    Route::get('/products/{id}', [AdminProductController::class, 'show'])->name('admin.products.show');

    // Orders management
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('admin.orders.index');
    Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('admin.orders.show');
    Route::put('/orders/{order}', [AdminOrderController::class, 'update'])->name('admin.orders.update');
    Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('admin.orders.updateStatus');
});

// Order placed success page
Route::get('/order-placed', function () {
    return Inertia::render('OrderPlaced');
})->name('order.placed');

// User order details route
Route::middleware('auth')->group(function () {
    Route::get('/orders/{order}', function($order) {
        $order = \App\Models\Order::with('order_items.product')->where('id', $order)->where('user_id', auth()->id())->firstOrFail();
        return inertia('OrderShow', ['order' => $order]);
    })->name('orders.show');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/orders/{order}/invoice', [AdminOrderController::class, 'downloadInvoice'])->name('admin.orders.invoice');
});

require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
