<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->enum('visibility', ['public', 'private'])->default('private')->after('status');
        });

        // Artikel yang sudah ada sebelum fitur ini dibuat, anggap semuanya publik
        DB::table('articles')->update(['visibility' => 'public']);
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn('visibility');
        });
    }
};