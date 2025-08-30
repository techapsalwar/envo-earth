<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Auth\Events\Login;
use App\Listeners\MigrateSessionCart;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        Login::class => [
            MigrateSessionCart::class,
        ],
    ];

    public function boot(): void
    {
        parent::boot();
    }
}
