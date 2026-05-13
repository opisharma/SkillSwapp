<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserStoppedTyping implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public User $user,
        public int $matchId,
    ) {
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("chat.{$this->matchId}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'user.stopped-typing';
    }

    public function broadcastWith(): array
    {
        return [
            'user_id' => $this->user->id,
        ];
    }
}
