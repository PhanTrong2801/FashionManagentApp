<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $shirts = Category::where('name', 'Áo sơ mi')->first();
        $pants = Category::where('name', 'Quần jean')->first();
        $dresses = Category::where('name', 'Váy')->first();
        $shoes = Category::where('name', 'Giày dép')->first();
        $accessories = Category::where('name', 'Phụ kiện')->first();

        // 1. Áo sơ mi
        Product::create(['code' =>'SMT','name' => 'Áo sơ mi trắng classic', 'category_id' => $shirts->id, 'price' => 250000, 'stock' => 20, 'size' => 'M', 'color' => 'Trắng']);
        Product::create(['code' =>'SMB','name' => 'Áo sơ mi caro xanh', 'category_id' => $shirts->id, 'price' => 280000, 'stock' => 15, 'size' => 'L', 'color' => 'Xanh']);
        
        // 2. Quần jean
        Product::create(['code' =>'QJX','name' => 'Quần jean xanh skinny', 'category_id' => $pants->id, 'price' => 350000, 'stock' => 15, 'size' => '32', 'color' => 'Xanh']);
        Product::create(['code' =>'QJD','name' => 'Quần jean đen ống rộng', 'category_id' => $pants->id, 'price' => 380000, 'stock' => 10, 'size' => '30', 'color' => 'Đen']);
        
        // 3. Váy
        Product::create(['code' =>'VHL','name' => 'Váy hoa nhí lụa', 'category_id' => $dresses->id, 'price' => 420000, 'stock' => 18, 'size' => 'S', 'color' => 'Hồng']);
        Product::create(['code' =>'VXT','name' => 'Váy xếp ly dài', 'category_id' => $dresses->id, 'price' => 390000, 'stock' => 12, 'size' => 'M', 'color' => 'Xám']);
        
        // 4. Giày dép
        Product::create(['code' =>'GDST','name' => 'Giày sneaker trắng', 'category_id' => $shoes->id, 'price' => 550000, 'stock' => 25, 'size' => '40', 'color' => 'Trắng']);
        Product::create(['code' =>'GDBK','name' => 'Giày bốt da đen', 'category_id' => $shoes->id, 'price' => 700000, 'stock' => 8, 'size' => '38', 'color' => 'Đen']);
        
        // 5. Phụ kiện
        Product::create(['code' =>'PKVT','name' => 'Ví da cầm tay', 'category_id' => $accessories->id, 'price' => 150000, 'stock' => 30, 'size' => 'F', 'color' => 'Nâu']);
        Product::create(['code' =>'PKDD','name' => 'Dây chuyền bạc', 'category_id' => $accessories->id, 'price' => 180000, 'stock' => 40, 'size' => 'F', 'color' => 'Bạc']);
    
    }
}
