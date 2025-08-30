<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Order;
use App\Models\Cart;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Display the user dashboard with cart items and orders.
     */
    public function dashboard()
    {
        $user = Auth::user();
        $cartItems = Cart::with('product')->where('user_id', $user->id)->get()->map(function($item) {
            return [
                'product' => $item->product,
                'quantity' => $item->quantity,
            ];
        });
        $orders = Order::with('order_items')->where('user_id', $user->id)->orderByDesc('created_at')->get();
        $activeOrders = $orders->whereIn('status', ['pending', 'processing', 'shipped'])->values();
        $pastOrders = $orders->whereIn('status', ['delivered', 'cancelled'])->values();
        return inertia('UserDashboard', [
            'cartItems' => $cartItems,
            'activeOrders' => $activeOrders,
            'pastOrders' => $pastOrders,
        ]);
    }
}
