<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Smalot\PdfParser\Parser as PdfParser;

class ArticleUploadController extends Controller
{
    public function __construct(protected GeminiService $gemini)
    {
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'file' => ['required', 'file', 'mimes:pdf', 'max:10240'],
        ]);

        $path = $request->file('file')->store('uploads/materials');
        $fullPath = storage_path('app/private/' . $path);

        if (! file_exists($fullPath)) {
            $fullPath = storage_path('app/' . $path);
        }

        $parser = new PdfParser();
        $pdf = $parser->parseFile($fullPath);
        $rawText = trim($pdf->getText());

        if (empty($rawText)) {
            return response()->json([
                'message' => 'Tidak bisa mengekstrak teks dari PDF ini. Pastikan PDF berisi teks (bukan hasil scan gambar).',
            ], 422);
        }

        $cleanedText = $this->sanitizeExtractedText($rawText);

        // Kirim ke Gemini untuk dirangkum jadi catatan belajar terstruktur
        $studyNotes = $this->gemini->generateStudyNotes($cleanedText);

        // Excerpt diambil dari rangkuman (bukan teks mentah PDF)
        $plainForExcerpt = preg_replace('/[#*`|>-]/', '', $studyNotes);
        $excerpt = Str::limit(trim($plainForExcerpt), 150);

        $slug = Str::slug($validated['title']);
        $originalSlug = $slug;
        $counter = 1;
        while (Article::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        $visibility = $request->user()->role === 'admin' ? 'public' : 'private';

        $article = Article::create([
            'user_id' => $request->user()->id,
            'category_id' => $validated['category_id'] ?? null,
            'title' => $validated['title'],
            'slug' => $slug,
            'excerpt' => $excerpt,
            'content' => $studyNotes,
            'status' => 'published',
            'visibility' => $visibility,
            'published_at' => now(),
        ]);

        return response()->json($article, 201);
    }

    protected function sanitizeExtractedText(string $text): string
    {
        $text = mb_convert_encoding($text, 'UTF-8', 'UTF-8');
        $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $text);

        return $text;
    }
}