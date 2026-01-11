<?php

namespace App\Http\Controllers;

use App\Models\WorkSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    // Xử lý Check-in / Check-out
    public function toggle()
    {
        $user = Auth::user();
        
        // Tìm xem có ca làm nào đang mở (chưa check-out) không
        $activeSession = WorkSession::where('user_id', $user->id)
            ->whereNull('check_out')
            ->latest()
            ->first();

        if ($activeSession) {
            // LOGIC CHECK OUT 
            $checkOutTime = now();
            $checkInTime = Carbon::parse($activeSession->check_in);
            
            // Tính số phút làm việc
            $minutes = $checkInTime->diffInMinutes($checkOutTime);
            
            // Tính lương: (Phút / 60) * Lương theo giờ
            $earned = ($minutes / 60) * $user->hourly_rate;

            $activeSession->update([
                'check_out' => $checkOutTime,
                'duration_minutes' => $minutes,
                'salary_earned' => $earned
            ]);

            return back()->with('success', "Đã kết thúc ca làm việc. Tổng: {$minutes} phút.");
        } else {
            //LOGIC CHECK IN 
            WorkSession::create([
                'user_id' => $user->id,
                'check_in' => now(),
            ]);

            return back()->with('success', 'Bắt đầu tính giờ làm việc! Chúc bạn làm việc tốt.');
        }
    }
}