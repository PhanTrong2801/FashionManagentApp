<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create([
            'name' => 'Trong User',
            'email' => 'tronguser@gmail.com',
            'password' => 'trong2801',
            'role' => 'user',
        ]);

        User::create([
            'name' => 'Trong Admin',
            'email' => 'trongadmin@gmail.com',
            'password' => 'trong2801',
            'role' => 'admin',
        ]);
    }
}
