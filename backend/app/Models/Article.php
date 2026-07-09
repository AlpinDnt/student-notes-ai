<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'cover_image',
        'status',
        'visibility',
        'tldr_summary',
        'tldr_generated_at',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'tldr_summary' => 'array',
            'tldr_generated_at' => 'datetime',
            'published_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function quiz(): HasOne
    {
        return $this->hasOne(Quiz::class);
    }

    /** Cek apakah TL;DR sudah pernah di-generate dan masih valid (belum kadaluarsa cache-nya) */
    public function hasFreshTldr(): bool
    {
        return ! empty($this->tldr_summary) && $this->tldr_generated_at !== null;
    }
}