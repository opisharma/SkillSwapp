<?php

namespace App\Services;

use App\Events\MessageRead;
use App\Events\MessageSent;
use App\Models\Message;
use App\Models\SkillMatch;
use App\Models\User;

class MessagingService
{
    public function send(SkillMatch $match, User $sender, string $body): Message
    {
        $receiverId = $match->user_one_id === $sender->id ? $match->user_two_id : $match->user_one_id;

        $message = Message::query()->create([
            'match_id' => $match->id,
            'sender_id' => $sender->id,
            'receiver_id' => $receiverId,
            'body' => trim($body),
        ]);

        // Load relationships for broadcasting
        $message->load(['sender', 'receiver', 'match']);

        try {
            // Broadcast the message sent event, but do not block delivery if Reverb is unavailable.
            MessageSent::dispatch($message);
        } catch (\Throwable $throwable) {
            logger()->warning('MessageSent broadcast failed.', [
                'message_id' => $message->id,
                'match_id' => $message->match_id,
                'error' => $throwable->getMessage(),
            ]);
        }

        return $message;
    }

    public function markConversationAsRead(SkillMatch $match, User $user): int
    {
        $unreadMessages = Message::query()
            ->where('match_id', $match->id)
            ->where('receiver_id', $user->id)
            ->whereNull('read_at')
            ->get();

        foreach ($unreadMessages as $message) {
            $message->update(['read_at' => now()]);

            try {
                MessageRead::dispatch($message);
            } catch (\Throwable $throwable) {
                logger()->warning('MessageRead broadcast failed.', [
                    'message_id' => $message->id,
                    'match_id' => $match->id,
                    'error' => $throwable->getMessage(),
                ]);
            }
        }

        return $unreadMessages->count();
    }

    public function markMessageAsRead(Message $message, User $user): bool
    {
        if ($message->receiver_id !== $user->id || $message->read_at !== null) {
            return false;
        }

        $message->update(['read_at' => now()]);

        try {
            MessageRead::dispatch($message);
        } catch (\Throwable $throwable) {
            logger()->warning('MessageRead broadcast failed.', [
                'message_id' => $message->id,
                'match_id' => $message->match_id,
                'error' => $throwable->getMessage(),
            ]);
        }

        return true;
    }
}
