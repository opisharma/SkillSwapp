<?php

namespace App\Services;

use App\Models\Message;
use App\Models\SkillMatch;
use App\Models\User;

class MessagingService
{
    public function send(SkillMatch $match, User $sender, string $body): Message
    {
        $receiverId = $match->user_one_id === $sender->id ? $match->user_two_id : $match->user_one_id;

        return Message::query()->create([
            'match_id' => $match->id,
            'sender_id' => $sender->id,
            'receiver_id' => $receiverId,
            'body' => trim($body),
        ]);
    }

    public function markConversationAsRead(SkillMatch $match, User $user): int
    {
        return Message::query()
            ->where('match_id', $match->id)
            ->where('receiver_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }
}
