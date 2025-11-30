<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Shift;
use Dotenv\Util\Str as UtilStr;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str as SupportStr;
use Psy\Util\Str;

class SalesController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        $products = Product::orderBy('name')->get();
        $customers = Customer::orderBy('name')->get();

        return Inertia::render('Sales/Dashboard', [
            'products' => $products,
            'categories' => $categories,
            'customers' => $customers,
        ]);
    }

    public function store(Request $request)
    {
        
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|string',
            'customer_money' => 'nullable|numeric|min:0',
            'change_money' => 'nullable|numeric|min:0',
            'customer_id' =>'nullable|exists:customers,id',
        ]);

        //dao bao tinh toan ven du lieu
        DB::beginTransaction();

        try{
            $total = 0;
            foreach ($validated['items'] as $item) {
                $product = Product::find($item['id']);
                if($product->stock < $item['quantity']){
                    return back()->withErrors(['msg' => "Sản phẩm {$product->name} không đủ hàng."]);
                }
                $total += $product->price * $item['quantity'];
            }

            $invoiceCode = 'INV-'. date('Ymd') . '-' . strtoupper(SupportStr::random(4));
            $currentShift = Shift::whereNull('end_time')->latest()->first();

            if(!$currentShift){
                return back()->with(['msg' => 'Chưa có ca làm việc nào được mở! Vui lòng mở ca trước.']);
            }

            $order = Order::create([
                'shift_id' =>$currentShift->id,
                'invoice_code' => $invoiceCode,
                'user_id' => Auth::id(),
                'customer_id'=>$validated['customer_id']??null,
                'total_amount' => $total,
                'payment_method'=> $validated['payment_method'],
                'customer_money'=> $validated['customer_money'] ??0,
                'change_money' => $validated['change_money'] ??0,
                'status' => 'completed',
            ]);

            

            //tu dong cong diem
            if($validated['customer_id']){
                $customer = Customer::find($validated['customer_id']);
                //10.000d = 1diem
                $earnedPoints = floor($total/10000);
                $customer->points +=$earnedPoints;
                $customer->updateRank();
            }

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
       
            DB::commit();

            return back()->with('success', 'Đã tạo hóa đơn thành công!');

         }catch(\Exception $e){
            DB::rollBack();
            return back()->withErrors('Đã có lỗi xảy ra khi tạo hóa đơn: '.$e->getMessage());
        }
    }

    public function invoices(Request $request)
{
    $query = Order::with('items.product', 'user','customer')
                ->where('status', 'completed')
                ->orderBy('created_at', 'DESC');

    // Lọc theo ngày
    if ($request->filled('day')) {
        $query->whereDate('created_at', $request->day); 
    }

    if($request->filled('search')){
        $search = $request->search;
        $query->where(function($q) use ($search){
            $q->where('invoice_code', 'like', '%'.$search.'%')
                ->orWhere('id',$search);
        });
    }

    $invoices = $query->paginate(20);

    return Inertia::render('Sales/InvoiceHistory', [
        'invoices' => $invoices,
        'filters' => [
            'day' => $request->day,
        ],
    ]);
}

}
