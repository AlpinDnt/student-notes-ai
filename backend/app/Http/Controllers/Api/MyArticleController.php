<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MyArticleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            Article::where('user_id', $request->user()->id)
                ->latest()
                ->get()
        );
    }
}