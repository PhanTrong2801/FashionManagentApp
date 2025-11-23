<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;

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

    public function adminIndex()
    {
        return Inertia::render('Admin/Products', [
            'products' => Product::with('category')->orderBy('id', 'DESC')->get(),
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            "name" => "required",
            "price" => "required|numeric",
            "stock" => "required|numeric",
            "category_id" => "required|exists:categories,id",
        ]);

        $product->update($request->all());
        return back();
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return back();
    }

    public function storeCategory(Request $request)
    {
        $request->validate([
            "name" => "required|string|max:255"
        ]);

        Category::create([
            "name" => $request->name
        ]);

        return back();
    }

    public function updateCategory(Request $request, Category $category)
    {
        $request->validate([
            "name" => "required|string|max:255"
        ]);

        $category->update([
            "name" => $request->name
        ]);

        return back();
    }

    public function destroyCategory(Category $category)
    {
        $category->delete();
        return back();
    }
}
