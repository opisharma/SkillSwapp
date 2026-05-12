<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageNotificationCreated implements ShouldBroadcastNow
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(public array $notification)
    {
    }

    public function broadcastOn(): array
    {
        return [new PrivateChannel('users.' . $this->notification['user_id'])];
    }

    public function broadcastWith(): array
    {
        return $this->notification;
    }
}