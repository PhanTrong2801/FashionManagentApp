<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'user_id','customer_id', 'total', 'payment_method', 'customer_money', 'change_money'
    ];

    public function items(){
        return $this->hasMany(InvoiceItem::class);
    }

    public function customer(){
        return $this->belongsTo(Customer::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
