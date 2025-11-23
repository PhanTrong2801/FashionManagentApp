<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Request;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'name', 'color', 'size', 'price', 'stock','category_id'
    ];

   public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function store(Request $request)
    {
        $request->validate([
            "name" => "required",
            "price" => "required|numeric",
            "stock" => "required|numeric",
            "category_id" => "required|exists:categories,id",
        ]);

        Product::create($request->all());
        return back();
    }

    
    
}
