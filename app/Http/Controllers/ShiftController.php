<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
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
            ->where('user_id', $user->id)
            ->whereNull('end_time')
            ->first();

        $liveRevenue = Invoice::where('user_id', $user->id)
                                ->whereBetween('created_at', [$currentShift?->start_time ?? now(), now()])
                                ->sum('total');

        return Inertia::render('Sales/Shifts', [
            'activeShift' => $currentShift,
            'shifts' => Shift::with('user')
                ->where('user_id', $user->id)
                ->orderBy('id', 'DESC')
                ->get(),
            'liveRevenue' =>$liveRevenue,
        ]);
    }

    public function start(Request $request)
    {
        $request->validate([
            'opening_cash' => 'required|integer|min:0'
        ]);

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

        $shift = Shift::where('user_id', Auth::id())
            ->whereNull('end_time')
            ->firstOrFail();

        $invoices = Invoice::where('user_id', Auth::id())
            ->whereBetween('created_at', [$shift->start_time, now()])
            ->get();

        $totalRevenue = $invoices->sum('total');
        $totalCash = $invoices->where('payment_method', 'cash')->sum('total');
        $totalBank = $invoices->where('payment_method', 'bank')->sum('total');

        $difference = ($shift->opening_cash + $totalCash +$totalBank) - $request->closing_cash;

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
