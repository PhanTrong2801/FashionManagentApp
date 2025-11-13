<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = ['Áo sơ mi', 'Quần jean', 'Váy', 'Giày dép', 'Phụ kiện'];
        foreach ($categories as $name) {
            Category::create(['name' => $name]);
    }
    }
}
