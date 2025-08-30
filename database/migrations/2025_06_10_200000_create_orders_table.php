<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->string('address');
            $table->string('city');
            $table->string('state');
            $table->string('pin')->nullable(); // Indian PIN code, allow null for backward compatibility
            $table->string('country');
            $table->decimal('total', 10, 2);
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
