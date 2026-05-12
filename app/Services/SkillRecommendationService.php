<?php

namespace App\Services;

use App\Models\Skill;
use App\Models\User;
use Illuminate\Support\Collection;

class SkillRecommendationService
{
    public function suggest(User $user, int $limit = 5): Collection
    {
        $existing = $user->userSkills()->pluck('skill_id');

        return Skill::query()
            ->whereNotIn('id', $existing)
            ->inRandomOrder()
            ->limit($limit)
            ->get();
    }
}
