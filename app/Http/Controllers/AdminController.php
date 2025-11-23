<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard(Request $request){

        // Doanh thu
        $todayRevenue = Order::whereDate('created_at',today())->sum('total_amount');
        $monthRevenue = Order::whereMonth('created_at',now()->month)->sum('total_amount');

        // Tổng số liệu
        $totalOrders = Order::count();
        $totalProducts = Product::count();

        // Top sản phẩm bán chạy
        $topProducts = DB::table('order_items')
            ->join('products','order_items.product_id','=','products.id')
            ->select('products.name', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->groupBy('products.name')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        // Sản phẩm sắp hết hàng
        $lowStock = Product::where('stock','<',10)->get();


        // ⭐ Thống kê nhân viên
        $staffPerformance = DB::table('orders')
            ->join('users', 'orders.user_id', '=', 'users.id')
            ->select(
                'users.id',
                'users.name',
                DB::raw('COUNT(orders.id) as total_orders'),
                DB::raw('SUM(orders.total_amount) as total_revenue')
            )
            ->whereMonth('orders.created_at', now()->month)
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('total_revenue')
            ->get();


        // ⭐ Thống kê ca làm trong ngày
        $todayShifts = DB::table('shifts')
            ->join('users', 'shifts.user_id', '=', 'users.id')
            ->whereDate('shifts.start_time', today())
            ->select(
                'shifts.*',
                'users.name as user_name'
            )
            ->orderBy('shifts.start_time','DESC')
            ->get();


        return Inertia::render('Admin/Dashboard',[
            'todayRevenue' => $todayRevenue,
            'monthRevenue' => $monthRevenue,
            'totalOrders' => $totalOrders,
            'totalProducts' => $totalProducts,
            'topProducts' => $topProducts,
            'lowStock' => $lowStock,
            'staffPerformance' => $staffPerformance,
            'todayShifts' => $todayShifts,
        ]);
    }

    
}
