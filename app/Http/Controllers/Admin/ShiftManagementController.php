<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Shift;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShiftManagementController extends Controller
{
    public function index()
    {
        // Lấy danh sách ca làm, sắp xếp mới nhất lên đầu
        $shifts = Shift::with('user') // Lấy kèm thông tin nhân viên
            ->orderBy('id', 'desc')
            ->paginate(15); // Phân trang 15 dòng

        return Inertia::render('Admin/Shifts/Index', [
            'shifts' => $shifts
        ]);
    }
}
