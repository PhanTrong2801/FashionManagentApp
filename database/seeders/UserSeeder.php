<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tạo Admin
        User::create([
            'name' => 'Quản Lý (Admin)',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('123456'),
            'role' => 'admin',
            'hourly_rate' => 0,
        ]);

        // 2. Tạo 3 Nhân viên bán hàng
        $staffs = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'];
        foreach ($staffs as $index => $name) {
            User::create([
                'name' => $name,
                'email' => 'user' . ($index + 1) . '@gmail.com', // user1@gmail.com
                'password' => Hash::make('123456'),
                'role' => 'user',
                'hourly_rate' => 20000 + ($index * 2000), // Lương mỗi người khác nhau tí
            ]);
        }
    }
}