<?php

namespace App\Repositories\Eloquent;

use App\Models\SkillMatch;
use App\Repositories\Contracts\MatchRepositoryInterface;
use Illuminate\Support\Collection;

class MatchRepository implements MatchRepositoryInterface
{
    public function forUser(int $userId): Collection
    {
        return SkillMatch::query()
            ->where(function ($query) use ($userId) {
                $query->where('user_one_id', $userId)
                      ->orWhere('user_two_id', $userId);
            })
            ->with(['userOne', 'userTwo'])
            ->orderByDesc('match_percentage')
            ->get();
    }

    public function createOrUpdatePair(int $userOneId, int $userTwoId, int $matchPercentage, array $mutualSkills): SkillMatch
    {
        return SkillMatch::query()->updateOrCreate(
            ['user_one_id' => $userOneId, 'user_two_id' => $userTwoId],
            ['match_percentage' => $matchPercentage, 'mutual_skills' => $mutualSkills]
        );
    }
}
