<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Shift;
use App\Models\User;
use App\Models\WorkSession;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('role', 'user')->get();
        $products = Product::all();
        
        // Lặp qua 30 ngày gần nhất (để vẽ biểu đồ)
        for ($i = 30; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            
            // --- 1. Tạo CHẤM CÔNG (Payroll) ---
            foreach ($users as $user) {
                // Giả lập: Nhân viên đi làm ngẫu nhiên, có ngày nghỉ
                if (rand(0, 10) > 2) { 
                    $checkIn = $date->copy()->setHour(8)->setMinute(rand(0, 30));
                    $checkOut = $date->copy()->setHour(17)->setMinute(rand(0, 30));
                    $minutes = $checkIn->diffInMinutes($checkOut);
                    
                    WorkSession::create([
                        'user_id' => $user->id,
                        'check_in' => $checkIn,
                        'check_out' => $checkOut,
                        'duration_minutes' => $minutes,
                        'salary_earned' => ($minutes / 60) * $user->hourly_rate,
                    ]);
                }
            }

            // --- 2. Tạo CA LÀM VIỆC (Shift) ---
            // Mỗi ngày 1 ca từ 8h -> 22h
            $shiftUser = $users->random();
            $shiftStart = $date->copy()->setHour(8);
            $shiftEnd = $date->copy()->setHour(22);
            
            $shift = Shift::create([
                'user_id' => $shiftUser->id,
                'start_time' => $shiftStart,
                'end_time' => $shiftEnd, // Ca đã đóng
                'opening_cash' => 1000000, // Vốn 1tr
                'closing_cash' => 0, // Tạm để 0, tính sau
            ]);

            // --- 3. Tạo ĐƠN HÀNG trong ca ---
            $totalRevenue = 0;
            $totalCash = 0;
            $totalBank = 0;
            
            // Random 5-15 đơn mỗi ngày
            $ordersCount = rand(5, 15); 
            
            for ($j = 0; $j < $ordersCount; $j++) {
                $orderUser = $users->random();
                $paymentMethod = rand(0, 1) ? 'cash' : 'bank';
                
                // Mua 1-3 sản phẩm
                $cartItems = $products->random(rand(1, 3));
                $orderTotal = 0;
                
                $order = Order::create([
                    'invoice_code' => 'INV-' . $date->format('Ymd') . '-' . Str::random(4),
                    'user_id' => $orderUser->id,
                    'shift_id' => $shift->id,
                    'customer_id' => rand(1, 10), // Random khách VIP
                    'payment_method' => $paymentMethod,
                    'status' => 'completed',
                    'total_amount' => 0, // Update sau
                    'created_at' => $date->copy()->setHour(rand(9, 21)), // Giờ ngẫu nhiên trong ngày
                ]);

                foreach ($cartItems as $prod) {
                    $qty = rand(1, 2);
                    $subtotal = $prod->price * $qty;
                    $orderTotal += $subtotal;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $prod->id,
                        'quantity' => $qty,
                        'price' => $prod->price,
                        'subtotal' => $subtotal,
                    ]);
                }

                $order->update(['total_amount' => $orderTotal]);
                
                $totalRevenue += $orderTotal;
                if ($paymentMethod === 'cash') $totalCash += $orderTotal;
                else $totalBank += $orderTotal;
            }

            // --- 4. Cập nhật số liệu Đóng Ca ---
            // Giả lập có ngày bị lệch tiền (Difference)
            $actualCash = 1000000 + $totalCash + (rand(0, 5) === 0 ? -50000 : 0); // Thi thoảng mất 50k

            $shift->update([
                'total_revenue' => $totalRevenue,
                'total_cash' => $totalCash,
                'total_bank' => $totalBank,
                'closing_cash' => $actualCash,
                'difference' => $actualCash - (1000000 + $totalCash)
            ]);
        }
    }
}