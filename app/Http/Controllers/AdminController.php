<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard(Request $request)
    {
        // Thống kê Doanh thu
        $todayRevenue = Order::whereDate('created_at', today())->sum('total_amount');
        $monthRevenue = Order::whereMonth('created_at', now()->month)
                             ->whereYear('created_at', now()->year)
                             ->sum('total_amount');

        //  Doanh thu năm
        $yearRevenue = Order::whereYear('created_at', now()->year)->sum('total_amount');

        // Tổng số liệu
        $totalOrders = Order::count();
        $totalProducts = Product::count();

        // Top sản phẩm bán chạy (Kèm doanh thu)
        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->select(
                'products.name',
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.subtotal) as revenue') // Lấy thêm doanh thu từng món
            )
            ->groupBy('products.name', 'products.id') // Group by ID cho chắc chắn
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        // Sản phẩm sắp hết hàng (Lấy sp có stock < 10)
        $lowStock = Product::where('stock', '<', 10)
            ->orderBy('stock', 'asc') // Ưu tiên hiện cái sắp hết nhất
            ->limit(10)
            ->get();

        //  Thống kê nhân viên (Sửa alias khớp với React)
        $staffPerformance = DB::table('orders')
            ->join('users', 'orders.user_id', '=', 'users.id')
            ->select(
                'users.id',
                'users.name',
                DB::raw('COUNT(orders.id) as orders_count'),
                DB::raw('SUM(orders.total_amount) as revenue')
            )
            ->whereMonth('orders.created_at', now()->month)
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('revenue')
            ->get();

        //  Ca làm việc gần nhất
        $shiftsSummary = DB::table('shifts')
            ->join('users', 'shifts.user_id', '=', 'users.id')
            ->select(
                'shifts.*',
                'users.name as user_name'
            )
            ->orderBy('shifts.start_time', 'DESC')
            ->limit(5) // Chỉ lấy 5 ca gần nhất
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'todayRevenue' => $todayRevenue,
            'monthRevenue' => $monthRevenue,
            'yearRevenue' => $yearRevenue,
            'totalOrders' => $totalOrders,
            'totalProducts' => $totalProducts,
            'topProducts' => $topProducts,
            'lowStock' => $lowStock,
            'staffPerformance' => $staffPerformance,
            'shiftsSummary' => $shiftsSummary, 
        ]);
    }
}
