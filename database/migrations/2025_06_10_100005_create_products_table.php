<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            // We will create the categories table next, so this foreign key is ready for it.
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->text('description');
            $table->decimal('price', 8, 2);
            $table->decimal('sale_price', 8, 2)->nullable();
            $table->unsignedInteger('stock_quantity');
            $table->string('sku')->unique()->nullable();
            $table->json('images')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->string('product_type');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
