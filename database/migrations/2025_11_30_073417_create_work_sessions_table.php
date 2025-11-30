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
        Schema::create('work_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->dateTime('check_in'); 
            $table->dateTime('check_out')->nullable(); 
            $table->integer('duration_minutes')->default(0); 
            $table->decimal('salary_earned', 15, 2)->default(0);
            $table->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
        $table->decimal('hourly_rate', 10, 2)->default(20000); // Mặc định 20k/giờ
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_sessions');
    }
};
