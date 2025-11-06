<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SalesController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

});




require __DIR__.'/auth.php';

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/sales', [SalesController::class, 'index'])->name('sales.dashboard');
    Route::post('/sales', [SalesController::class, 'store'])->name('sales.store');

    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/Dashboard', [
            'title' => 'Trang Quản Lý',
        ]);
    })->middleware('admin')->name('admin.dashboard');
});

Route::middleware(['auth', 'admin'])->group(function (){
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']) ->name('admin.dashboard');
});