<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class GeminiService
{
    protected string $apiKey;
    protected string $model;
    protected string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key');
        $this->model = config('services.gemini.model');
    }

    /**
     * Generate ringkasan 3 poin (TL;DR) dari konten artikel.
     */
    public function generateSummary(string $articleContent): array
    {
        $pointCount = $this->calculateSummaryPointCount($articleContent);

        $prompt = "Anda adalah asisten AI yang merangkum artikel teknologi/edukasi untuk pelajar.\n"
            . "Ringkas artikel berikut menjadi TEPAT {$pointCount} poin utama (TL;DR), singkat, jelas, dan mencakup keseluruhan isi artikel (bukan hanya bagian awal).\n\n"
            . "ATURAN KETAT:\n"
            . "- Balas HANYA dalam format JSON sesuai skema yang diberikan.\n"
            . "- Jangan menambahkan teks, penjelasan, atau markdown code fence apapun di luar JSON.\n"
            . "- Setiap poin maksimal 1-2 kalimat.\n\n"
            . "Artikel:\n\"\"\"\n{$articleContent}\n\"\"\"";

        $schema = [
            'type' => 'OBJECT',
            'properties' => [
                'summary_points' => [
                    'type' => 'ARRAY',
                    'items' => ['type' => 'STRING'],
                    'minItems' => $pointCount,
                    'maxItems' => $pointCount,
                ],
            ],
            'required' => ['summary_points'],
        ];

        $result = $this->request($prompt, $schema);

        return $result['summary_points'] ?? [];
    }

    /**
     * Hitung jumlah poin TL;DR berdasarkan panjang artikel.
     * Basis: 3 poin minimum, +1 poin tiap 300 kata tambahan, maksimal 7 poin.
     */
    protected function calculateSummaryPointCount(string $content): int
    {
        $wordCount = str_word_count(strip_tags($content));
        $extraPoints = intdiv($wordCount, 300);

        return max(3, min(7, 3 + $extraPoints));
    }

    /**
     * Generate soal kuis pilihan ganda + flashcard dari konten artikel.
     */
        public function generateQuizAndFlashcards(string $articleContent): array
    {
        $questionCount = $this->calculateQuestionCount($articleContent);

        $prompt = "Anda adalah asisten AI pembuat soal kuis dan flashcard untuk pelajar/mahasiswa berdasarkan artikel teknis berikut.\n\n"
            . "Buatlah:\n"
            . "1. TEPAT {$questionCount} soal pilihan ganda untuk menguji pemahaman pembaca terhadap isi artikel.\n"
            . "2. 5 flashcard (istilah/konsep penting dari artikel beserta penjelasan singkatnya).\n\n"
            . "ATURAN KETAT:\n"
            . "- Balas HANYA dalam format JSON sesuai skema yang diberikan, tanpa teks tambahan apapun.\n"
            . "- Setiap soal pilihan ganda harus punya TEPAT 4 opsi jawaban.\n"
            . "- Field \"correct_answer_index\" adalah index (0-3) dari opsi yang benar di array \"options\".\n"
            . "- Field \"explanation\" berisi penjelasan singkat kenapa jawaban itu benar.\n"
            . "- Soal harus tersebar mencakup keseluruhan isi artikel, tidak hanya bagian awal.\n"
            . "- Gunakan Bahasa Indonesia untuk semua konten.\n\n"
            . "Artikel:\n\"\"\"\n{$articleContent}\n\"\"\"";

        $schema = [
            'type' => 'OBJECT',
            'properties' => [
                'questions' => [
                    'type' => 'ARRAY',
                    'items' => [
                        'type' => 'OBJECT',
                        'properties' => [
                            'question' => ['type' => 'STRING'],
                            'options' => [
                                'type' => 'ARRAY',
                                'items' => ['type' => 'STRING'],
                                'minItems' => 4,
                                'maxItems' => 4,
                            ],
                            'correct_answer_index' => ['type' => 'INTEGER'],
                            'explanation' => ['type' => 'STRING'],
                        ],
                        'required' => ['question', 'options', 'correct_answer_index', 'explanation'],
                    ],
                    'minItems' => $questionCount,
                    'maxItems' => $questionCount,
                ],
                'flashcards' => [
                    'type' => 'ARRAY',
                    'items' => [
                        'type' => 'OBJECT',
                        'properties' => [
                            'front' => ['type' => 'STRING'],
                            'back' => ['type' => 'STRING'],
                        ],
                        'required' => ['front', 'back'],
                    ],
                    'minItems' => 5,
                    'maxItems' => 5,
                ],
            ],
            'required' => ['questions', 'flashcards'],
        ];

        return $this->request($prompt, $schema);
    }

    /**
     * Hitung jumlah soal berdasarkan panjang artikel.
     * Basis: 5 soal minimum, +1 soal tiap 150 kata tambahan, dibatasi maksimal 15 soal
     * (supaya tidak boros kuota Free Tier & waktu generate tidak terlalu lama).
     */
    protected function calculateQuestionCount(string $content): int
    {
        $wordCount = str_word_count(strip_tags($content));
        $extraQuestions = intdiv($wordCount, 150);

        return max(5, min(15, 5 + $extraQuestions));
    }

    /**
     * Kirim request ke Gemini API dengan JSON schema ketat (structured output).
     */
    protected function request(string $prompt, array $schema): array
    {
        $response = Http::timeout(60)->post(
            "{$this->baseUrl}/{$this->model}:generateContent?key={$this->apiKey}",
            [
                'contents' => [
                    ['parts' => [['text' => $prompt]]],
                ],
                'generationConfig' => [
                    'responseMimeType' => 'application/json',
                    'responseSchema' => $schema,
                    'temperature' => 0.4,
                ],
            ]
        );

        if ($response->failed()) {
            Log::error('Gemini API error', ['body' => $response->body()]);
            throw new RuntimeException('Gagal menghubungi Gemini API: HTTP ' . $response->status());
        }

        $text = $response->json('candidates.0.content.parts.0.text');

        if (! $text) {
            throw new RuntimeException('Respons Gemini API kosong atau tidak sesuai format yang diharapkan.');
        }

        $decoded = json_decode($text, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::error('Gemini JSON parse error', ['raw' => $text]);
            throw new RuntimeException('Gagal parsing JSON dari respons Gemini API.');
        }

        return $decoded;
    }

    public function generateStudyNotes(string $rawContent): string
{
    // Batasi ukuran teks yang dikirim, supaya tidak terlalu berat/lama untuk dokumen sangat panjang (misal buku ratusan halaman)
    $maxChars = 60000;
    $trimmedContent = mb_substr($rawContent, 0, $maxChars);

    $prompt = "Anda adalah asisten AI yang bertugas membuat CATATAN BELAJAR (rangkuman materi) dari sebuah dokumen/buku ajar untuk pelajar/mahasiswa.\n\n"
        . "Ubah seluruh isi dokumen berikut menjadi catatan belajar terstruktur dalam format Markdown, dengan gaya seperti berikut:\n"
        . "- Bagi menjadi beberapa bagian bernomor (1., 2., 3., dst) sesuai topik utama di dokumen, gunakan heading level 2 (##) untuk tiap judul bagian.\n"
        . "- Di setiap bagian, tulis poin-poin penting dalam bentuk bullet list singkat, BUKAN paragraf panjang.\n"
        . "- Sertakan definisi singkat, istilah penting, dan contoh konkret bila ada di dokumen aslinya.\n"
        . "- Jika ada kode program atau query (SQL dsb), sertakan dalam code block Markdown.\n"
        . "- Jika ada perbandingan konsep, gunakan tabel Markdown.\n"
        . "- Di akhir catatan, WAJIB tambahkan bagian terakhir berjudul \"## Ringkasan Super Singkat\" berisi poin-poin inti dari SELURUH dokumen (maksimal 15 poin).\n"
        . "- Cakup seluruh bagian utama dokumen secara proporsional, jangan hanya fokus di bagian awal.\n"
        . "- Gunakan Bahasa Indonesia.\n"
        . "- Balas HANYA dengan isi catatan dalam format Markdown, tanpa kalimat pembuka/penutup atau catatan tambahan apapun.\n\n"
        . "Dokumen:\n\"\"\"\n{$trimmedContent}\n\"\"\"";

    return $this->requestPlainText($prompt, 8192, 120);
}

/**
 * Kirim request ke Gemini API tanpa skema JSON ketat — dipakai untuk hasil
 * berupa teks/Markdown bebas (bukan data terstruktur).
 */
    protected function requestPlainText(string $prompt, int $maxOutputTokens = 4096, int $timeoutSeconds = 60): string
    {
        $response = Http::timeout($timeoutSeconds)->post(
            "{$this->baseUrl}/{$this->model}:generateContent?key={$this->apiKey}",
            [
                'contents' => [
                    ['parts' => [['text' => $prompt]]],
                ],
                'generationConfig' => [
                    'temperature' => 0.3,
                    'maxOutputTokens' => $maxOutputTokens,
                ],
            ]
        );

        if ($response->failed()) {
            Log::error('Gemini API error', ['body' => $response->body()]);
            throw new RuntimeException('Gagal menghubungi Gemini API: HTTP ' . $response->status());
        }

        $text = $response->json('candidates.0.content.parts.0.text');

        if (! $text) {
            throw new RuntimeException('Respons Gemini API kosong.');
        }

        $text = trim($text);
        // Bersihkan kalau Gemini membungkus jawaban dengan code fence markdown
        $text = preg_replace('/^```(?:markdown)?\n/', '', $text);
        $text = preg_replace('/\n```$/', '', $text);

        return trim($text);
    }
}