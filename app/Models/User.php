<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory;
    use Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'university',
        'department',
        'bio',
        'profile_photo',
        'availability',
        'is_admin',
        'is_banned',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_admin' => 'boolean',
        'is_banned' => 'boolean',
    ];

    public function userSkills(): HasMany
    {
        return $this->hasMany(UserSkill::class);
    }

    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function hostedSessions(): HasMany
    {
        return $this->hasMany(Session::class, 'host_user_id');
    }

    public function participantSessions(): HasMany
    {
        return $this->hasMany(Session::class, 'participant_user_id');
    }

    public function writtenReviews(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }

    public function receivedReviews(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewed_user_id');
    }

    public function notificationsList(): HasMany
    {
        return $this->hasMany(Notification::class);
    }
}
