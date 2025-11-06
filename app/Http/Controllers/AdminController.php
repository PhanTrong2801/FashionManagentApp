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
        // Thong ke doanh thu
        $todayRevenue = Order::whereDate('created_at',today())->sum('total_amount');

        $monthRevenue = Order::whereMonth('created_at',now()->month)->sum('total_price');

        $totalOrders = Order::count();
        $totalProducts = Product::count();

        // Top spham ban chay
        $topProducts = DB::table('order_items')
            ->join('products','order_items.product_id','=','products.id')
            ->select('products.name', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->groupBy('products.name')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();


        // SPham ton kho thap
        $lowStock = Product::where('stock','<',10)->get();

        return Inertia::render('Admin/Dashboard',[
            'todayRevenue' => $todayRevenue,
            'monthRevenue' => $monthRevenue,
            'totalOrders' => $totalOrders,
            'totalProducts' => $totalProducts,
            'topProducts' => $topProducts,
            'lowStock' => $lowStock,
        ]);
    }
}
