<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class SalesController extends Controller
{
    public function index()
    {
        $products = Product::orderBy('name')->get();

        return Inertia::render('Sales/Dashboard', [
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|string',
        ]);

        $total = 0;
        foreach ($validated['items'] as $item) {
            $product = Product::find($item['id']);
            $subtotal = $product->price * $item['quantity'];
            $total += $subtotal;
        }

        $order = Order::create([
            'user_id' => Auth::id(),
            'total_amount' => $total,
            'payment_method' => $validated['payment_method'],
            'status' => 'paid',
        ]);

        foreach ($validated['items'] as $item) {
            $product = Product::find($item['id']);
            $subtotal = $product->price * $item['quantity'];

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'price' => $product->price,
                'subtotal' => $subtotal,
            ]);

            $product->decrement('stock', $item['quantity']);
        }

        return back()->with('success', 'Đã tạo hóa đơn thành công!');
    }
}
