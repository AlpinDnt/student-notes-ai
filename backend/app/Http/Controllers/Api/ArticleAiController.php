<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Quiz;
use App\Services\GeminiService;
use Illuminate\Http\JsonResponse;

class ArticleAiController extends Controller
{
    public function __construct(protected GeminiService $gemini)
    {
    }

    /**
     * GET /api/articles/{article}/tldr
     */
    public function tldr(Article $article): JsonResponse
    {
        $this->authorizeAccess($article);
        if ($article->hasFreshTldr()) {
            return response()->json([
                'summary_points' => $article->tldr_summary,
                'cached' => true,
            ]);
        }

        $summaryPoints = $this->gemini->generateSummary($article->content);

        $article->update([
            'tldr_summary' => $summaryPoints,
            'tldr_generated_at' => now(),
        ]);

        return response()->json([
            'summary_points' => $summaryPoints,
            'cached' => false,
        ]);
    }

    /**
     * GET /api/articles/{article}/quiz
     */
    public function quiz(Article $article): JsonResponse
    {
         $this->authorizeAccess($article);
        $existingQuiz = $article->quiz;

        if ($existingQuiz && $existingQuiz->questions) {
            return response()->json([
                'questions' => $existingQuiz->questions,
                'flashcards' => $existingQuiz->flashcards,
                'cached' => true,
            ]);
        }

        $result = $this->gemini->generateQuizAndFlashcards($article->content);

        $quiz = Quiz::updateOrCreate(
            ['article_id' => $article->id],
            [
                'questions' => $result['questions'] ?? [],
                'flashcards' => $result['flashcards'] ?? [],
                'generated_at' => now(),
            ]
        );

        return response()->json([
            'questions' => $quiz->questions,
            'flashcards' => $quiz->flashcards,
            'cached' => false,
        ]);
    }
    protected function authorizeAccess(Article $article): void
    {
        if ($article->visibility === 'private') {
            $user = auth('sanctum')->user();

            if (! $user || $user->id !== $article->user_id) {
                abort(403, 'Materi ini bersifat privat dan hanya bisa diakses oleh pemiliknya.');
            }
        }
    }
}