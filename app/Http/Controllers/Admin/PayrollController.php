<?php

namespace App\Http\Controllers\Admin;

use App\Exports\PayrollExport;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

use function Symfony\Component\Clock\now;

class PayrollController extends Controller
{
    public function index(Request $request)
    {
        // Mặc định lấy tháng hiện tại
        $month = $request->input('month', date('n'));
        $year = $request->input('year', date('y'));

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

    public function updateRate(Request $request, $id){
        $request->validate([
            'hourly_rate' => 'required|numeric|min:0'
        ]);
        $user = User::findOrFail($id);
        $user->update(['hourly_rate' =>$request->hourly_rate]);
        return back()->with('success', "Đã cập nhật lương cho {$user->name}");
    }

    public function export(Request $request){
        $month = $request->input('month', date('n'));
        $year = $request->input('year', date('y'));

        return Excel::download(new PayrollExport($month,$year), "bang-luong-thang-$month-$year.xlsx");
    }

    public function getDetails(Request $request, $id)
    {
        $month = $request->input('month');
        $year = $request->input('year');

        $sessions =DB::table('work_sessions')
            ->where('user_id', $id)
            ->whereMonth('check_in', $month)
            ->whereYear('check_in', $year)
            ->orderBy('check_in', 'desc')
            ->select('check_in', 'check_out', 'duration_minutes') 
            ->get();

        return response()->json($sessions);
    }
}