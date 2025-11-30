<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    protected $fillable = [
        'user_id',
        'start_time',
        'end_time',
        'opening_cash',
        'closing_cash',
        'total_revenue',
        'total_cash',
        'total_bank',
        'difference'
    ];

    public function user (){
        return $this->belongsTo(User::class);
    }
    
}
