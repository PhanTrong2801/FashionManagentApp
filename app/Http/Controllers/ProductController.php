<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Category;

class ProductController extends Controller
{
      public function inventory()
    {
        // Lấy tất cả danh mục cùng sản phẩm
        $categories = Category::with('products')->get();

        return Inertia::render('Sales/Inventory', [
            'categories' => $categories,
        ]);
    }
}
