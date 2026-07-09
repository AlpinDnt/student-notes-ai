<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin Student Notes',
            'email' => 'admin@studentnotes.test',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        $this->call([
            CategorySeeder::class,
            ArticleSeeder::class,
        ]);
    }
}