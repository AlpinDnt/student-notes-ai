<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ArticleController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Article::with('category', 'user')
                ->where('status', 'published')
                ->where('visibility', 'public')
                ->latest('published_at')
                ->get()
        );
    }

    public function show(Article $article): JsonResponse
    {
        $this->authorizeAccess($article);

        return response()->json($article->load('category', 'user'));
    }

    protected function authorizeAccess(Article $article): void
    {
        if ($article->visibility === 'private') {
            $user = auth('sanctum')->user();

            if (! $user || $user->id !== $article->user_id) {
                throw new HttpException(403, 'Materi ini bersifat privat dan hanya bisa diakses oleh pemiliknya.');
            }
        }
    }
}