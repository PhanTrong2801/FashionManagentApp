<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'user_id', 'total', 'payment_method', 'customer_money', 'change_money'
    ];

    public function items(){
        return $this->hasMany(InvoiceItem::class);
    }
}
