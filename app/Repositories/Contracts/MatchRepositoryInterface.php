<?php

namespace App\Repositories\Contracts;

use App\Models\SkillMatch;
use Illuminate\Support\Collection;

interface MatchRepositoryInterface
{
    public function forUser(int $userId): Collection;

    public function createOrUpdatePair(int $userOneId, int $userTwoId, int $matchPercentage, array $mutualSkills): SkillMatch;
}
