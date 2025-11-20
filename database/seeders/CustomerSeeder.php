<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Customer::create([
            'name' => 'Nguyễn Văn A',
            'phone' => '0901234567',
            'address' => '123 Đường Trần Hưng Đạo, Q.1, TP.HCM',
        ]);
        
        Customer::create([
            'name' => 'Trần Thị B',
            'phone' => '0987654321',
            'address' => '456 Đường Lê Lợi, Q. Bình Thạnh, TP.HCM',
        ]);

        Customer::create([
            'name' => 'Lê Văn C',
            'phone' => '0912345678',
            'address' => '789 Đường 3 Tháng 2, Q.10, Hà Nội',
        ]);

        Customer::create([
            'name' => 'Phạm Thị D',
            'phone' => '0977889900',
            'address' => '101 Đường Nguyễn Huệ, Q. Hoàn Kiếm, Hà Nội',
        ]);

        Customer::create([
            'name' => 'Hoàng Minh E',
            'phone' => '0966554433',
            'address' => '202 Đường Sư Vạn Hạnh, Q.5, TP.HCM',
        ]);
    }
}
