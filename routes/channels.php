<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('users.{userId}', function ($user, int $userId): bool {
    return (int) $user->id === $userId;
});

// Chat channel for real-time messaging
Broadcast::channel('chat.{conversationId}', function ($user, int $conversationId): bool {
    // Verify user is part of this conversation
    return \App\Models\SkillMatch::query()
        ->where('id', $conversationId)
        ->where(function ($query) use ($user) {
            $query->where('user_one_id', $user->id)
                ->orWhere('user_two_id', $user->id);
        })
        ->exists();
});

// Presence channel for online status
Broadcast::channel('online.{userId}', function ($user, int $userId): bool {
    return (int) $user->id === $userId;
});