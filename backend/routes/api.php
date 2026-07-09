<?php

use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\ArticleAiController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\ArticleUploadController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MyArticleController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{article}', [ArticleController::class, 'show']);
Route::get('/articles/{article}/tldr', [ArticleAiController::class, 'tldr']);
Route::get('/articles/{article}/quiz', [ArticleAiController::class, 'quiz']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/articles/upload', [ArticleUploadController::class, 'store']);
    Route::get('/my-articles', [MyArticleController::class, 'index']);

    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy']);
        Route::get('/stats', [AdminUserController::class, 'stats']);
    });
});