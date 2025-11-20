<?php

namespace App\Http\Controllers;

use App\Models\Customer;
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
}
