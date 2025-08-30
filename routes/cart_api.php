<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/cart-count', function (Request $request) {
    $cart = session('cart', []);
    $count = array_sum(array_column($cart, 'quantity'));
    return response()->json(['count' => $count]);
});
