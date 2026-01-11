<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user', 'customer', 'items.product']);

        //  Tìm kiếm
        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('invoice_code', 'like', "%{$search}%")
                  ->orWhere('id', $search)
                  ->orWhereHas('customer', function ($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%")
                         ->orWhere('phone', 'like', "%{$search}%");
                  });
            });
        }

        //  Lọc theo ngày
        if ($request->date) {
            $query->whereDate('created_at', $request->date);
        }

        //  Sắp xếp mới nhất trước
        $orders = $query->orderBy('id', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'date']),
        ]);
    }

    public function update(Request $request, Order $order)
    {
        //  Validate dữ liệu gửi lên
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'nullable',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
            'edit_note' => 'required|string',
        ]);

        DB::transaction(function () use ($order, $validated) {
            //  HOÀN TRẢ KHO
            foreach ($order->items as $oldItem) {
                $product = $oldItem->product;
                if ($product) {
                    $product->increment('stock', $oldItem->quantity);
                }
            }

            // Xóa items cũ
            $order->items()->delete();

            // Tạo items mới và TRỪ KHO MỚI
            $totalAmount = 0;
            foreach ($validated['items'] as $newItem) {
                $subtotal = $newItem['price'] * $newItem['quantity'];
                $totalAmount += $subtotal;

                // Tạo item mới
                $order->items()->create([
                    'product_id' => $newItem['product_id'],
                    'quantity' => $newItem['quantity'],
                    'price' => $newItem['price'],
                    'subtotal' => $subtotal,
                ]);

                // Trừ kho
                $product = \App\Models\Product::find($newItem['product_id']);
                if ($product) {
                    if ($product->stock < $newItem['quantity']) {
                        throw new \Exception("Sản phẩm {$product->name} không đủ tồn kho!");
                    }
                    $product->decrement('stock', $newItem['quantity']);
                }
            }

            // Cập nhật thông tin đơn hàng
            $order->update([
                'total_amount' => $totalAmount,
                'is_edited' => true, 
                'edit_note' => $validated['edit_note'],
            ]);
        });

        return back()->with('success', 'Đơn hàng đã được chỉnh sửa thành công!');
    }
}
