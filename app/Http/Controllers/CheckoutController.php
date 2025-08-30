<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    // Show the checkout page
    public function index(Request $request)
    {
        if (auth()->check()) {
            // Authenticated: get cart from DB
            $cartItems = \App\Models\Cart::with('product')
                ->where('user_id', auth()->id())
                ->get()
                ->map(function ($item) {
                    return [
                        'product' => $item->product,
                        'quantity' => $item->quantity
                    ];
                });
        } else {
            // Guest: get cart from session
            $cart = session('cart', []);
            $cartItems = [];
            foreach ($cart as $item) {
                $product = \App\Models\Product::find($item['product_id']);
                if ($product) {
                    $cartItems[] = [
                        'product' => $product,
                        'quantity' => $item['quantity']
                    ];
                }
            }
        }
        return Inertia::render('Checkout/Index', [
            'cartItems' => $cartItems,
        ]);
    }

    // Handle order submission (for now, just clear cart and return success)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'pin' => 'required|string',
            'country' => 'required|string',
            'password' => 'nullable|string|min:6',
        ]);

        // Use DB cart for authenticated users
        if (auth()->check()) {
            $cart = [];
            $dbCart = \App\Models\Cart::where('user_id', auth()->id())->get();
            foreach ($dbCart as $item) {
                $cart[$item->product_id] = [
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity
                ];
            }
        } else {
            $cart = session('cart', []);
        }
        if (empty($cart)) {
            return back()->withErrors(['cart' => 'Your cart is empty.']);
        }

        // User registration or fetch
        $user = auth()->user();
        if (!$user) {
            $user = User::where('email', $request->email)->first();
            if (!$user) {
                $request->validate(['password' => 'required|string|min:6']);
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                ]);
            }
            auth()->login($user);
        }

        // Save phone, address, city, state, pin, country to user profile if NULL or empty
        $userNeedsUpdate = false;
        $fields = ['phone', 'address', 'city', 'state', 'pin', 'country'];
        $updateData = [];
        foreach ($fields as $field) {
            if (empty($user->$field)) {
                $updateData[$field] = $request->$field;
                $userNeedsUpdate = true;
            }
        }
        if ($userNeedsUpdate) {
            $user->update($updateData);
        }

        // Create order
        $products = Product::whereIn('id', array_keys($cart))->get();
        $total = 0;
        $order = Order::create([
            'user_id' => $user->id,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'city' => $request->city,
            'state' => $request->state,
            'pin' => $request->pin,
            'country' => $request->country,
            'total' => 0, // will update after items
            'status' => 'pending',
        ]);
        foreach ($products as $product) {
            $quantity = $cart[$product->id]['quantity'] ?? 1;
            $lineTotal = $product->price * $quantity;
            $total += $lineTotal;
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'price' => $product->price,
                'quantity' => $quantity,
            ]);
        }
        $order->update(['total' => $total]);

        // Send email to user and admin (basic text for now)
        try {
            Mail::raw("Thank you for your order #{$order->id}! We'll process it soon.", function($m) use ($order) {
                $m->to($order->email)->subject('Order Confirmation');
            });
            Mail::raw("New order #{$order->id} placed by {$order->name}.", function($m) {
                $m->to(config('mail.from.address'))->subject('New Order Received');
            });
        } catch (\Exception $e) {}

        // After order placed, clear persistent cart for user
        \App\Models\Cart::where('user_id', $user->id)->delete();

        session()->forget('cart');
        // Redirect to OrderPlaced page instead of checkout.index
        return redirect()->route('order.placed');
    }
}
