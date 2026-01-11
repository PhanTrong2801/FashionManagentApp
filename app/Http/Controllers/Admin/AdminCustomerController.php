<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminCustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::orderBy('points', 'desc'); 

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('phone', 'like', '%' . $request->search . '%');
        }

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }
}
