<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\MonthlyRevenueExport;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);

        // 1. Dữ liệu biểu đồ: Gom nhóm doanh thu theo NGÀY trong tháng
        $dailyRevenue = Order::select(
                DB::raw('DATE(created_at) as date'), 
                DB::raw('SUM(total_amount) as total')
            )
            ->whereMonth('created_at', $month)
            ->whereYear('created_at', $year)
            ->where('status', 'completed')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => date('d/m', strtotime($item->date)), // Format ngày cho gọn (01/12)
                    'total' => (int)$item->total
                ];
            });

        // 2. Tổng kết số liệu
        $totalRevenue = Order::whereMonth('created_at', $month)
            ->whereYear('created_at', $year)
            ->where('status', 'completed')
            ->sum('total_amount');

        $totalOrders = Order::whereMonth('created_at', $month)
            ->whereYear('created_at', $year)
            ->where('status', 'completed')
            ->count();

        return Inertia::render('Admin/Reports/Index', [
            'chartData' => $dailyRevenue,
            'summary' => [
                'revenue' => $totalRevenue,
                'orders' => $totalOrders
            ],
            'filters' => ['month' => $month, 'year' => $year]
        ]);
    }

    public function export(Request $request)
    {
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);

        return Excel::download(new MonthlyRevenueExport($month, $year), "doanh-thu-thang-$month-$year.xlsx");
    }
}