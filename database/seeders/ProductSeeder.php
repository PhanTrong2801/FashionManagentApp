<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tạo Danh mục
        $cats = ['Áo Thun', 'Áo Sơ Mi', 'Quần Jean', 'Váy Đầm', 'Phụ Kiện'];
        $catIds = [];
        foreach ($cats as $c) {
            $catIds[] = Category::create(['name' => $c])->id;
        }

        // 2. Tạo Nhà Cung Cấp
        $suppliers = ['Xưởng May Hạnh Phúc', 'Fashion Global', 'Local Brand X'];
        $supIds = [];
        foreach ($suppliers as $s) {
            $supIds[] = Supplier::create([
                'name' => $s,
                'contact_name' => 'Anh Quản Lý',
                'phone' => '0909123456',
                'address' => 'Hồ Chí Minh'
            ])->id;
        }

        // 3. Tạo Khách Hàng
        Customer::create(['name' => 'Khách Vãng Lai', 'phone' => '0000000000', 'points' => 0]); // Khách lẻ
        for ($i = 1; $i <= 10; $i++) {
            Customer::create([
                'name' => "Khách VIP $i",
                'phone' => "098765432$i",
                'address' => "Sài Gòn",
                'points' => rand(100, 5000),
                'rank' => rand(0, 1) ? 'Gold' : 'Member'
            ]);
        }

        // 4. Tạo Sản Phẩm (20 món)
        $products = [
            ['name' => 'Áo Thun Basic Trắng', 'price' => 150000],
            ['name' => 'Áo Thun In Hình Mèo', 'price' => 180000],
            ['name' => 'Sơ Mi Công Sở Xanh', 'price' => 250000],
            ['name' => 'Sơ Mi Flannel Caro', 'price' => 320000],
            ['name' => 'Quần Jean Slimfit', 'price' => 450000],
            ['name' => 'Quần Short Kaki', 'price' => 200000],
            ['name' => 'Váy Hoa Nhí', 'price' => 350000],
            ['name' => 'Đầm Dự Tiệc Đen', 'price' => 550000],
            ['name' => 'Tất Cổ Cao (Set 3)', 'price' => 50000],
            ['name' => 'Mũ Lưỡi Trai', 'price' => 120000],
        ];

        foreach ($products as $key => $p) {
            Product::create([
                'code' => 'SP00' . ($key + 1),
                'name' => $p['name'],
                'price' => $p['price'],
                'stock' => rand(5, 50), // Có món ít, món nhiều
                'category_id' => $catIds[array_rand($catIds)],
                'supplier_id' => $supIds[array_rand($supIds)],// Bạn có thể thêm ảnh mẫu nếu muốn
            ]);
        }
        
        // Tạo thêm 1 món sắp hết hàng để test cảnh báo
        Product::create([
            'code' => 'SP_LOW', 'name' => 'Áo Khoác Bán Chạy', 'price' => 600000, 
            'stock' => 3, // Sắp hết
            'category_id' => $catIds[0], 'supplier_id' => $supIds[0]
        ]);
    }
}