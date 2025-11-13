<?php

use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ProductController as ControllersProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SalesController;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function (){
    if(!Auth::check()){
        return redirect()->route('login');
    }
    
    $user = Auth::user();
    if($user->role ==='admin'){
        return redirect()->route('admin.welcome');
    }
    return redirect()->route('sales.dashboard');
});

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/sales/inventory', [ControllersProductController::class, 'inventory'])->name('sales.inventory');

});




require __DIR__.'/auth.php';

//Route sau khi login
Route::middleware(['auth', 'verified'])->group(function () {

     // Neu là nhân viên -> trang bán hàng
    Route::get('/sales', [SalesController::class, 'index'])
        ->middleware('role:user')
        ->name('sales.dashboard');

    Route::post('/sales', [SalesController::class, 'store'])
        ->middleware('role:user')
        ->name('sales.store');

     // Neu là admin -> trang chào mừng
    Route::get('/admin/welcome',[AdminController::class, 'welcome'])
        ->middleware('role:admin')
        ->name('admin.welcome');
    // Trang quản lý admin
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])
        ->middleware('role:admin')
        ->name('admin.dashboard');

    Route::get('/admin/create-user', [UserManagementController::class, 'create'])->name('admin.createUser');
    Route::post('/admin/create-user', [UserManagementController::class, 'store'])->name('admin.storeUser');
});



Route::middleware(['auth', 'role:admin'])->group(function (){
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
});