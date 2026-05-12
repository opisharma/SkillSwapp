<?php

namespace App\Services;

use App\Events\MessageNotificationCreated;
use App\Models\Message;
use App\Models\Notification as UserNotification;
use App\Models\SkillMatch;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class NotificationService
{
    public function notifyMessageReceived(User $receiver, User $sender, SkillMatch $match, Message $message): UserNotification
    {
        $notification = UserNotification::query()->create([
            'user_id' => $receiver->id,
            'type' => 'message.received',
            'title' => 'New message from ' . $sender->name,
            'body' => Str::limit($message->body, 120),
            'data' => [
                'match_id' => $match->id,
                'message_id' => $message->id,
                'sender_id' => $sender->id,
                'sender_name' => $sender->name,
                'sender_photo' => $sender->profile_photo,
                'link' => route('chat.index', $match),
            ],
        ]);

        MessageNotificationCreated::dispatch($this->toPayload($notification));

        return $notification;
    }

    public function markMatchNotificationsRead(User $user, SkillMatch $match): int
    {
        return UserNotification::query()
            ->where('user_id', $user->id)
            ->where('type', 'message.received')
            ->where('data->match_id', $match->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    public function markRead(UserNotification $notification, User $user): bool
    {
        if ((int) $notification->user_id !== (int) $user->id) {
            return false;
        }

        if ($notification->read_at !== null) {
            return true;
        }

        $notification->forceFill(['read_at' => now()])->save();

        return true;
    }

    public function markAllRead(User $user): int
    {
        return UserNotification::query()
            ->where('user_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    public function unreadCount(User $user): int
    {
        return UserNotification::query()
            ->where('user_id', $user->id)
            ->whereNull('read_at')
            ->count();
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function latestForUser(User $user, int $limit = 5): Collection
    {
        return UserNotification::query()
            ->where('user_id', $user->id)
            ->latest()
            ->limit($limit)
            ->get()
            ->map(fn (UserNotification $notification): array => $this->toPayload($notification))
            ->values();
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function allForUser(User $user, int $limit = 50): Collection
    {
        return UserNotification::query()
            ->where('user_id', $user->id)
            ->latest()
            ->limit($limit)
            ->get()
            ->map(fn (UserNotification $notification): array => $this->toPayload($notification))
            ->values();
    }

    /**
     * @return array<string, mixed>
     */
    public function toPayload(UserNotification $notification): array
    {
        return [
            'id' => $notification->id,
            'user_id' => $notification->user_id,
            'type' => $notification->type,
            'title' => $notification->title,
            'body' => $notification->body,
            'data' => $notification->data ?? [],
            'link' => data_get($notification->data, 'link'),
            'read_at' => $notification->read_at?->toIso8601String(),
            'created_at' => $notification->created_at?->toIso8601String(),
        ];
    }
}