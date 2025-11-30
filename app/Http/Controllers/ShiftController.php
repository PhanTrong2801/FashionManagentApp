<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Shift;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ShiftController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $currentShift = Shift::with('user')
            ->whereNull('end_time')
            ->first();

        $bankOrders = [];
        $liveRevenue = 0;
        if ($currentShift) {
            $orders = Order::where('shift_id', $currentShift->id)->get();
        
        $liveRevenue = $orders->sum('total_amount');
        
        //  Lọc ra các đơn chuyển khoản để hiển thị chi tiết
        $bankOrders = Order::where('shift_id', $currentShift->id)
            ->where('payment_method', 'bank') 
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();
        }

        return Inertia::render('Sales/Shifts', [
            'activeShift' => $currentShift,
            'shifts' => Shift::with('user')
                ->orderBy('id', 'DESC')
                ->paginate(10),
            'liveRevenue' =>$liveRevenue,
            'bankOrders' => $bankOrders,
        ]);
    }

    public function start(Request $request)
    {
        $request->validate([
            'opening_cash' => 'required|integer|min:0'
        ]);
        // Kiểm tra xem nhân viên có đang quên đóng ca cũ không
        $existingShift = Shift::whereNull('end_time')->first();
        if ($existingShift) {
            return back()->withErrors(['msg' => 'Cửa hàng đang có một ca chưa đóng. Vui lòng đóng ca trước!']);
        }

        Shift::create([
            'user_id' => Auth::id(),
            'start_time' => now(),
            'opening_cash' => $request->opening_cash,
        ]);

        return back()->with('success', 'Đã mở ca làm!');
    }

    public function close(Request $request)
    {
        $request->validate([
            'closing_cash' => 'required|integer|min:0'
        ]);

        $shift = Shift::whereNull('end_time')
            ->firstOrFail();

        $orders = Order::where('shift_id', $shift->id)
            ->where('status', 'completed')
            ->get();

        $totalRevenue = $orders->sum('total_amount');
        $totalCash = $orders->where('payment_method', 'cash')->sum('total_amount');
        $totalBank = $orders->where('payment_method', 'bank')->sum('total_amount');

        $expectedCashInDrawer = $shift->opening_cash + $totalCash;
        $difference = $request->closing_cash - $expectedCashInDrawer;

        $shift->update([
            'end_time' => now(),
            'closing_cash' => $request->closing_cash,
            'total_revenue' => $totalRevenue,
            'total_cash' => $totalCash,
            'total_bank' => $totalBank,
            'difference' => $difference,
        ]);

        return back()->with('success', 'Đã kết ca!');
    }
}
