<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = $this->getCartItems();
        return Inertia::render('Cart/Index', [
            'cartItems' => $cartItems
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $product = Product::findOrFail($request->product_id);

        if (Auth::check()) {
            // For authenticated users, use database
            $cartItem = Cart::where('user_id', Auth::id())
                          ->where('product_id', $request->product_id)
                          ->first();

            if ($cartItem) {
                $cartItem->quantity += $request->quantity;
                $cartItem->save();
            } else {
                Cart::create([
                    'user_id' => Auth::id(),
                    'product_id' => $request->product_id,
                    'quantity' => $request->quantity
                ]);
            }
        } else {
            // For guests, use session
            $cart = Session::get('cart', []);
            $productId = $request->product_id;

            if (isset($cart[$productId])) {
                $cart[$productId]['quantity'] += $request->quantity;
            } else {
                $cart[$productId] = [
                    'product_id' => $productId,
                    'quantity' => $request->quantity
                ];
            }

            Session::put('cart', $cart);
        }

        return back();
    }

    public function remove(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);

        if (Auth::check()) {
            Cart::where('user_id', Auth::id())
                ->where('product_id', $request->product_id)
                ->delete();
        } else {
            $cart = Session::get('cart', []);
            unset($cart[$request->product_id]);
            Session::put('cart', $cart);
        }

        return back();
    }

    public function update(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        if (Auth::check()) {
            Cart::where('user_id', Auth::id())
                ->where('product_id', $request->product_id)
                ->update(['quantity' => $request->quantity]);
        } else {
            $cart = Session::get('cart', []);
            if (isset($cart[$request->product_id])) {
                $cart[$request->product_id]['quantity'] = $request->quantity;
                Session::put('cart', $cart);
            }
        }

        return back();
    }

    public function clear()
    {
        if (Auth::check()) {
            Cart::where('user_id', Auth::id())->delete();
        } else {
            Session::forget('cart');
        }

        return back();
    }

    private function getCartItems()
    {
        if (Auth::check()) {
            // Get cart items from database for authenticated users
            return Cart::with('product')
                      ->where('user_id', Auth::id())
                      ->get()
                      ->map(function ($item) {
                          return [
                              'product' => $item->product,
                              'quantity' => $item->quantity
                          ];
                      });
        } else {
            // Get cart items from session for guests
            $cart = Session::get('cart', []);
            $cartItems = [];

            foreach ($cart as $item) {
                $product = Product::find($item['product_id']);
                if ($product) {
                    $cartItems[] = [
                        'product' => $product,
                        'quantity' => $item['quantity']
                    ];
                }
            }

            return collect($cartItems);
        }
    }

    public function mergeGuestCart()
    {
        if (!Auth::check()) {
            return;
        }

        $guestCart = Session::get('cart', []);
        
        if (empty($guestCart)) {
            return;
        }

        foreach ($guestCart as $item) {
            $existingCartItem = Cart::where('user_id', Auth::id())
                                  ->where('product_id', $item['product_id'])
                                  ->first();

            if ($existingCartItem) {
                // Add guest cart quantity to existing cart item
                $existingCartItem->quantity += $item['quantity'];
                $existingCartItem->save();
            } else {
                // Create new cart item
                Cart::create([
                    'user_id' => Auth::id(),
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity']
                ]);
            }
        }

        // Clear guest cart from session
        Session::forget('cart');
    }

    // Returns the cart item count for CartBadge (supports both session and DB)
    public function cartCount(Request $request)
    {
        if (auth()->check()) {
            $count = \App\Models\Cart::where('user_id', auth()->id())->sum('quantity');
        } else {
            $cart = session('cart', []);
            $count = array_sum(array_column($cart, 'quantity'));
        }
        return response()->json(['count' => $count]);
    }
}
