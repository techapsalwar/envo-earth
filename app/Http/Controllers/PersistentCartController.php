<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PersistentCartController extends Controller
{
    // Show the cart page
    public function index(Request $request)
    {
        $user = Auth::user();
        $cartItems = [];
        if ($user) {
            $cartItems = Cart::with('product')->where('user_id', $user->id)->get()->map(function($item) {
                return [
                    'product' => $item->product,
                    'quantity' => $item->quantity,
                ];
            });
        }
        return Inertia::render('Cart/Index', [
            'cartItems' => $cartItems,
        ]);
    }

    // Add a product to the persistent cart
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'nullable|integer|min:1',
        ]);
        $user = Auth::user();
        if (!$user) {
            return back()->withErrors(['auth' => 'You must be logged in to add to cart.']);
        }
        $cartItem = Cart::firstOrNew([
            'user_id' => $user->id,
            'product_id' => $request->product_id,
        ]);
        $cartItem->quantity += $request->input('quantity', 1);
        $cartItem->save();
        return back()->with('success', 'Product added to cart!');
    }

    // Update quantity
    public function update(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);
        $user = Auth::user();
        if (!$user) {
            return back()->withErrors(['auth' => 'You must be logged in to update cart.']);
        }
        $cartItem = Cart::where('user_id', $user->id)->where('product_id', $request->product_id)->first();
        if ($cartItem) {
            $cartItem->quantity = $request->quantity;
            $cartItem->save();
        }
        return back()->with('success', 'Cart updated!');
    }

    // Remove item
    public function remove(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);
        $user = Auth::user();
        if (!$user) {
            return back()->withErrors(['auth' => 'You must be logged in to remove from cart.']);
        }
        Cart::where('user_id', $user->id)->where('product_id', $request->product_id)->delete();
        return back()->with('success', 'Item removed from cart!');
    }

    // Clear cart
    public function clear()
    {
        $user = Auth::user();
        if ($user) {
            Cart::where('user_id', $user->id)->delete();
        }
        return back()->with('success', 'Cart cleared!');
    }
}
