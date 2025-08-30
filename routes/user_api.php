<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

// Return user info for frontend (for guest checkout logic)
Route::get('/user', function(Request $request) {
    return ['user' => Auth::user()];
});
