<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $author = User::first();
        $category = Category::where('slug', 'web-development')->first();

        Article::create([
            'user_id' => $author->id,
            'category_id' => $category?->id,
            'title' => 'Memahami RESTful API dari Nol',
            'slug' => 'memahami-restful-api-dari-nol',
            'excerpt' => 'Panduan dasar konsep REST API untuk pemula, lengkap dengan contoh HTTP method dan status code.',
            'content' => <<<MARKDOWN
# Memahami RESTful API dari Nol

REST (Representational State Transfer) adalah gaya arsitektur untuk membangun web service.

## HTTP Method Utama

- **GET** — mengambil data
- **POST** — membuat data baru
- **PUT/PATCH** — memperbarui data
- **DELETE** — menghapus data

## Status Code Penting

| Kode | Arti |
|------|------|
| 200  | OK |
| 201  | Created |
| 404  | Not Found |
| 500  | Server Error |

## Kesimpulan

RESTful API menjadi standar komunikasi antara frontend dan backend karena sifatnya yang stateless dan mudah dipahami.
MARKDOWN,
            'status' => 'published',
            'published_at' => now(),
        ]);
    }
}