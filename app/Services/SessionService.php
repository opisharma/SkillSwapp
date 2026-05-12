<?php

namespace App\Services;

use App\Models\Session;
use App\Models\User;

class SessionService
{
    public function create(User $host, array $payload): Session
    {
        return Session::query()->create([
            'host_user_id' => $host->id,
            'participant_user_id' => $payload['participant_user_id'],
            'skill_id' => $payload['skill_id'],
            'meeting_link' => $payload['meeting_link'] ?? null,
            'session_time' => $payload['session_time'],
            'status' => 'pending',
        ]);
    }

    public function changeStatus(Session $session, string $status): Session
    {
        $session->update(['status' => $status]);

        return $session->refresh();
    }
}
