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
        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            //mo, dong ca
            $table->datetime('start_time');
            $table->datetime('end_time')->nullable();
            //tien dau, cuoi ca
            $table->integer('opening_cash');
            $table->integer('closing_cash')->nullable();
            //doanh thu
            $table->integer('total_revenue')->default(0);
            $table->integer('total_cash')->default(0);
            $table->integer('total_bank')->default(0);
            $table->integer('difference')->default(0); //tien lech
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shifts');
    }
};
