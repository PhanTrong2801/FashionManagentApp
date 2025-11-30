<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkSession extends Model
{
    protected $fillable = ['user_id', 'check_in', 'check_out', 'duration_minutes', 'salary_earned'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
