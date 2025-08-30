<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminOrderController;
use Illuminate\Support\Facades\Route;

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
    Route::get('/orders/{order}/invoice', [AdminOrderController::class, 'generateInvoice'])->name('admin.orders.invoice');
});
