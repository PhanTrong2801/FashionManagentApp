<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;
    protected $fillable = [
        'name', 'phone', 'address','points','rank'
    ];

    public function invoices(){
        return $this->hasMany(Invoice::class);
    }

    public function updateRank(){
        if($this->points >= 5000){
            $this->rank = 'Diamond';
        }elseif($this->points >=2000){
            $this->rank = 'Gold';
        }elseif($this->points >=500){
            $this->rank = 'Silver';
        }else{
            $this->rank = 'Normal';
        }
        $this->save();
    }
}
