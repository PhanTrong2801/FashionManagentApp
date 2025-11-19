<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SalesController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        $products = Product::orderBy('name')->get();

        return Inertia::render('Sales/Dashboard', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|string',
            'customer_money' => 'nullable|numeic|min:0',
            'change_money' => 'nullable|numeric',
        ]);

        //dao bao tinh toan ven du lieu
        DB::beginTransaction();

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
          //Tao hoa don
        $invoice = Invoice::create([
            'user_id' => Auth::id(),
            'total'=> $total,
            'payment_method'=> $validated['payment_method'],
            'customer_money'=> $validated['customer_money'] ??0,
            'change_money' => $validated['change_money'] ??0,
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
            InvoiceItem::create([
                'invoice_id' =>$invoice->id,
                'product_id'=>$product->id,
                'quantity' =>$item['quantity'],
                'price'=>$product->price,
            ]);

            $product->decrement('stock', $item['quantity']);
        }
        DB::commit();
      


        return back()->with('success', 'Đã tạo hóa đơn thành công!');
    }

    public function invoices(Request $request)
{
    $query = Invoice::with('items.product', 'items')->orderBy('id', 'DESC');

    // Lọc theo ngày
    if ($request->filled('day')) {
        $query->whereDate('created_at', $request->day); 
    }

    $invoices = $query->get();

    return Inertia::render('Sales/InvoiceHistory', [
        'invoices' => $invoices,
        'filters' => [
            'day' => $request->day,
        ],
    ]);
}

}
