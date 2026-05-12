<?php

namespace App\Policies;

use App\Models\SkillMatch;
use App\Models\User;

class SkillMatchPolicy
{
    public function view(User $user, SkillMatch $match): bool
    {
        return $match->user_one_id === $user->id || $match->user_two_id === $user->id;
    }
}
