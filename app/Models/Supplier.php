<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'contact_name', 'phone', 'email', 'address', 'note'];

    // Quan hệ: 1 Nhà cung cấp có nhiều Sản phẩm
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
