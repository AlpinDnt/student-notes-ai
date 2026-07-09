<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Web Development',
            'Python',
            'Algoritma & Struktur Data',
            'Machine Learning',
            'DevOps',
        ];

        foreach ($categories as $name) {
            Category::create([
                'name' => $name,
                'slug' => str($name)->slug(),
            ]);
        }
    }
}