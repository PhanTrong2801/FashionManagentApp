<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema; // Quan trọng để fix lỗi truncate

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // // 1. TẮT KHÓA NGOẠI ĐỂ TRUNCATE (XÓA SẠCH) DỮ LIỆU CŨ KHÔNG BỊ LỖI
        // Schema::disableForeignKeyConstraints();

        // DB::table('order_items')->truncate();
        // DB::table('orders')->truncate();
        // DB::table('products')->truncate();
        // DB::table('customers')->truncate();
        // DB::table('suppliers')->truncate();
        // DB::table('categories')->truncate();

        // Schema::enableForeignKeyConstraints();
        // // ---------------------------------------------------------

        // 2. TẠO DANH MỤC
        $cats = ['Áo Thun', 'Áo Sơ Mi', 'Quần Jean', 'Váy Đầm', 'Phụ Kiện'];
        $catIds = [];
        foreach ($cats as $c) {
            $catIds[] = Category::create(['name' => $c])->id;
        }

        // 3. TẠO NHÀ CUNG CẤP
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

        // 4. TẠO KHÁCH HÀNG
        $customerIds = [];
        $customerIds[] = Customer::create(['name' => 'Khách Vãng Lai', 'phone' => '0000000000', 'points' => 0])->id; 
        for ($i = 1; $i <= 10; $i++) {
            $customerIds[] = Customer::create([
                'name' => "Khách VIP $i",
                'phone' => "098765432$i",
                'address' => "Sài Gòn",
                'points' => rand(100, 5000),
                'rank' => rand(0, 1) ? 'Gold' : 'Member'
            ])->id;
        }

        // 5. TẠO SẢN PHẨM (Kèm Color & Size)
        $productsData = [
            ['name' => 'Áo Thun Basic', 'price' => 150000],
            ['name' => 'Áo Thun In Hình', 'price' => 180000],
            ['name' => 'Sơ Mi Công Sở', 'price' => 250000],
            ['name' => 'Quần Jean Slimfit', 'price' => 450000],
            ['name' => 'Váy Hoa Nhí', 'price' => 350000],
        ];

        $colors = ['Trắng', 'Đen', 'Xám', 'Xanh Navy', 'Đỏ'];
        $sizes  = ['S', 'M', 'L', 'XL'];

        foreach ($productsData as $key => $p) {
            // Mỗi món tạo 3 biến thể
            for ($k = 0; $k < 3; $k++) {
                Product::create([
                    'code' => 'SP-' . rand(10000, 99999), // Tạo mã random
                    'name' => $p['name'],
                    'price' => $p['price'],
                    'stock' => rand(5, 50),
                    'category_id' => $catIds[array_rand($catIds)],
                    'supplier_id' => $supIds[array_rand($supIds)],
                    'color' => $colors[array_rand($colors)],
                    'size'  => $sizes[array_rand($sizes)],
                ]);
            }
        }

        // 6. TẠO ĐƠN HÀNG (Dựa theo Model Order.php và OrderItem.php của bạn)
        // Lấy danh sách ID sản phẩm vừa tạo
        $productIds = Product::pluck('id')->toArray();

        for ($i = 0; $i < 20; $i++) {
            $randomCusId = $customerIds[array_rand($customerIds)];
            
            // Random mua 1-3 món
            $randomProdIds = array_rand(array_flip($productIds), rand(1, 3));
            if (!is_array($randomProdIds)) $randomProdIds = [$randomProdIds];

            $totalAmount = 0;
            $orderItemsData = [];

            foreach ($randomProdIds as $pid) {
                $prod = Product::find($pid);
                $qty = rand(1, 2);
                $subtotal = $prod->price * $qty; // Tính thành tiền
                $totalAmount += $subtotal;
                
                $orderItemsData[] = [
                    'product_id' => $prod->id,
                    'quantity' => $qty,
                    'price' => $prod->price,
                    'subtotal' => $subtotal, // Model OrderItem dùng 'subtotal'
                ];
            }

            // Logic tiền khách đưa
            $customerMoney = $totalAmount; 
            if (rand(0, 1)) {
                $customerMoney = $totalAmount + rand(10000, 500000); // Khách đưa dư
                $customerMoney = ceil($customerMoney / 10000) * 10000; // Làm tròn
            }
            $changeMoney = $customerMoney - $totalAmount;

            // Tạo Order
            $order = Order::create([
                'invoice_code' => 'HD-' . time() . $i, // Model dùng invoice_code
                'user_id' => 1, // Giả sử user ID 1 bán
                'customer_id' => $randomCusId,
                'total_amount' => $totalAmount,
                'payment_method' => 'cash', // Mặc định tiền mặt
                'status' => 'completed',
                'customer_money' => $customerMoney,
                'change_money' => $changeMoney,
                'created_at' => now()->subDays(rand(0, 30))
            ]);

            // Tạo OrderItems
            foreach ($orderItemsData as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $item['subtotal'],
                ]);
            }
        }
    }
}