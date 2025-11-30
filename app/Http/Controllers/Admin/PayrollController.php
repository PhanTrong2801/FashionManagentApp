<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PayrollController extends Controller
{
    public function index(Request $request)
    {
        // Mặc định lấy tháng hiện tại
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);

        // Thống kê theo nhân viên
        $payroll = User::where('role', 'user') // Chỉ lấy nhân viên
            ->with(['work_sessions' => function($q) use ($month, $year) {
                $q->whereMonth('check_in', $month)
                  ->whereYear('check_in', $year)
                  ->whereNotNull('check_out');
            }])
            ->get()
            ->map(function ($user) {
                $totalMinutes = $user->work_sessions->sum('duration_minutes');
                $totalSalary = $user->work_sessions->sum('salary_earned');
                
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'total_hours' => round($totalMinutes / 60, 1), // Đổi ra giờ
                    'hourly_rate' => $user->hourly_rate,
                    'total_salary' => $totalSalary,
                    'sessions_count' => $user->work_sessions->count()
                ];
            });

        return Inertia::render('Admin/Payroll/Index', [
            'payroll' => $payroll,
            'filters' => ['month' => $month, 'year' => $year]
        ]);
    }
}