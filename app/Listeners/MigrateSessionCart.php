<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use App\Models\Cart;

class MigrateSessionCart
{
    /**
     * Handle the event.
     */
    public function handle(Login $event)
    {
        $user = $event->user;
        $sessionCart = session('cart', []);
        if (!empty($sessionCart)) {
            foreach ($sessionCart as $productId => $item) {
                $cartItem = \App\Models\Cart::firstOrNew([
                    'user_id' => $user->id,
                    'product_id' => $productId,
                ]);
                // Always take the max quantity between session and DB
                $cartItem->quantity = max($cartItem->quantity, $item['quantity'] ?? 1);
                $cartItem->save();
            }
            session()->forget('cart');
        }
    }
}
