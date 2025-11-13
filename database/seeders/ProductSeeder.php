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

        Product::create(['code' =>'SMT','name' => 'Áo sơ mi trắng', 'category_id' => $shirts->id, 'price' => 250000, 'stock' => 20, 'size' => 'M', 'color' => 'Trắng']);
        Product::create(['code' =>'QJX','name' => 'Quần jean xanh', 'category_id' => $pants->id, 'price' => 350000, 'stock' => 15, 'size' => '32', 'color' => 'Xanh']);
    }
}
