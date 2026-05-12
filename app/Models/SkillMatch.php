<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SkillMatch extends Model
{
    use HasFactory;

    protected $table = 'matches';

    protected $fillable = [
        'user_one_id',
        'user_two_id',
        'match_percentage',
        'mutual_skills',
    ];

    protected $casts = [
        'mutual_skills' => 'array',
    ];

    public function userOne(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_one_id');
    }

    public function userTwo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_two_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'match_id');
    }
}
