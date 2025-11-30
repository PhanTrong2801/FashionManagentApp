<?php

use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController ;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\ShiftController;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function (){
    if(!Auth::check()){
        return redirect()->route('login');
    }
    
    $user = Auth::user();
    if($user->role ==='admin'){
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('sales.dashboard');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/sales/inventory', [ProductController::class, 'inventory'])->name('sales.inventory');

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

    //Don hang
    Route::get('/sales/invoices', [SalesController::class, 'invoices'])->name('sales.invoices');

    //Khachhang
    Route::get('/sales/customers', [CustomerController::class, 'index'])->name('sales.customers');
    Route::post('/sales/customers', [CustomerController::class, 'store'])->name('sales.customers.store');
    Route::put('/sales/customers/{customer}', [CustomerController::class, 'update'])->name('sales.customers.update');
    Route::delete('/sales/customers/{customer}', [CustomerController::class, 'destroy'])->name('sales.customers.destroy');
    Route::get('/sales/customers/{id}/history', [CustomerController::class, 'history'])->name('sales.customers.history');


 
    // Trang quản lý admin
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])
        ->middleware('role:admin')
        ->name('admin.dashboard');

    Route::post('/attendance/toggle', [AttendanceController::class, 'toggle'])->name('attendance.toggle');


});

Route::prefix('sales')->middleware(['auth', 'role:user'])->group(function () {
    Route::get('/shifts', [ShiftController::class, 'index']);
    Route::post('/shifts/start', [ShiftController::class, 'start']);
    Route::post('/shifts/close', [ShiftController::class, 'close']);
});



Route::middleware(['auth', 'role:admin'])
    ->group(function (){
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);


    Route::get('/products', [ ProductController::class, 'adminIndex'])->name('admin.products');
    Route::post('/products', [ProductController::class, 'store'])->name('admin.products.store');
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('admin.products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('admin.products.destroy');

    // Danh mục
    Route::post('/categories', [ProductController::class, 'storeCategory'])->name('admin.categories.store');
    Route::put('/categories/{category}', [ProductController::class, 'updateCategory'])->name('admin.categories.update');
    Route::delete('/categories/{category}', [ProductController::class, 'destroyCategory'])->name('admin.categories.destroy');

    Route::resource('admin/users', UserManagementController::class)->names('admin.users');
    Route::get('/admin/shifts', [\App\Http\Controllers\Admin\ShiftManagementController::class, 'index'])->name('admin.shifts.index');
    Route::get('/admin/orders', [\App\Http\Controllers\Admin\OrderManagementController::class, 'index'])
        ->name('admin.orders.index');

    // 2. Quản lý Khách hàng
    Route::get('/admin/customers', [\App\Http\Controllers\Admin\AdminCustomerController::class, 'index'])
        ->name('admin.customers.index');

    Route::get('/admin/payroll', [\App\Http\Controllers\Admin\PayrollController::class, 'index'])
    ->name('admin.payroll.index');

});