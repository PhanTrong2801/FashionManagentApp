<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request){
        $search = $request->search;

        $customers = Customer::when($search, function ($query) use ($search){
            $query->where('name', 'LIKE', "%$search%")
                ->orWhere('phone', 'LIKE', "%$search%");
        })
        ->orderBy('id', 'DESC')
        ->get();

        return Inertia::render('Sales/Customers', [
            'customers' => $customers,
            'search' => $search,
        ]);
    }

    public function store (Request $request){
        $request->validate([
            'name'  => 'required|string|max:255',
            'phone' => 'required|string|max:20|unique:customers,phone',
            'address' => 'nullable|string'
        ]);

        Customer::create($request->all());

        return back()->with('success', 'Đã thêm khách hàng thành công!');
    }

    public function update (Request $request,Customer $customer){
        $request->validate([
            'name' => 'required',
            'phone' => 'required',
            'address' => 'nullable'
        ]);

        $customer->update($request->all());
        return back()->with('success','Cập nhật thành công' );
    }

    public function destroy (Customer $customer){
        if ($customer->orders()->count() >0){
            return back()->withErrors(['error' => 'Không thể xoá khách đã mua hàng!']);
        }
        $customer->delete();

        return back()->with('success', 'Đã xoá khách hàng');
    }

    public function history($id){
        $customer = Customer::findOrFail($id);

        $invoices = Invoice::with('items.product')
            ->where('customer_id', $id)
            ->orderBy('id','DESC')
            ->get();
        
            return Inertia::render('Sales/CustomerHistory', [
                'customer' => $customer,
                'invoices' => $invoices
            ]);
    }

}
