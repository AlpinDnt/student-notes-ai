<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::withCount('articles')
            ->where('role', '!=', 'admin')
            ->latest()
            ->get(['id', 'name', 'email', 'role', 'created_at']);

        return response()->json($users);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($user->id === $request->user()->id) {
            abort(422, 'Tidak bisa menghapus akun sendiri.');
        }

        if ($user->role === 'admin') {
            abort(422, 'Tidak bisa menghapus akun admin.');
        }

        $user->delete();

        return response()->json(['message' => 'User berhasil dihapus.']);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'total_users' => User::where('role', '!=', 'admin')->count(),
            'total_articles' => Article::count(),
            'articles_today' => Article::whereDate('created_at', today())->count(),
        ]);
    }
}