<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Session extends Model
{
    use HasFactory;

    protected $table = 'skill_sessions';

    protected $fillable = [
        'host_user_id',
        'participant_user_id',
        'skill_id',
        'meeting_link',
        'session_time',
        'status',
    ];

    protected $casts = [
        'session_time' => 'datetime',
    ];

    public function host(): BelongsTo
    {
        return $this->belongsTo(User::class, 'host_user_id');
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'participant_user_id');
    }

    public function skill(): BelongsTo
    {
        return $this->belongsTo(Skill::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
