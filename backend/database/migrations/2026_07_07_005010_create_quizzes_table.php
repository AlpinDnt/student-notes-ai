<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->unique()->constrained()->cascadeOnDelete();

            // Cache hasil AI Quiz & Flashcard Generator (disimpan sebagai JSON)
            $table->json('questions')->nullable();   // array pertanyaan pilihan ganda
            $table->json('flashcards')->nullable();  // array flashcard (front/back)

            $table->timestamp('generated_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};