<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user', 'customer', 'items.product']);

        // 1. Tìm kiếm (Mã đơn hoặc Tên khách)
        if ($request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('invoice_code', 'like', "%{$search}%")
                  ->orWhere('id', $search)
                  ->orWhereHas('customer', function($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%")
                         ->orWhere('phone', 'like', "%{$search}%");
                  });
            });
        }

        // 2. Lọc theo ngày
        if ($request->date) {
            $query->whereDate('created_at', $request->date);
        }

        // 3. Sắp xếp mới nhất trước
        $orders = $query->orderBy('id', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'date']),
        ]);
    }
}
