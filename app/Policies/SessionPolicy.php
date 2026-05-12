<?php

namespace App\Policies;

use App\Models\Session;
use App\Models\User;

class SessionPolicy
{
    public function view(User $user, Session $session): bool
    {
        return $session->host_user_id === $user->id || $session->participant_user_id === $user->id;
    }

    public function updateStatus(User $user, Session $session): bool
    {
        return $session->host_user_id === $user->id || $session->participant_user_id === $user->id;
    }
}
