<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $query = Supplier::withCount('products'); // Đếm xem NCC này cung cấp bao nhiêu SP

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('phone', 'like', '%' . $request->search . '%');
        }

        return Inertia::render('Admin/Suppliers/Index', [
            'suppliers' => $query->orderBy('id', 'desc')->paginate(10),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email',
        ]);

        Supplier::create($request->all());

        return back()->with('success', 'Thêm nhà cung cấp thành công!');
    }

    public function update(Request $request, Supplier $supplier)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $supplier->update($request->all());

        return back()->with('success', 'Cập nhật thành công!');
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        return back()->with('success', 'Đã xóa nhà cung cấp!');
    }
}