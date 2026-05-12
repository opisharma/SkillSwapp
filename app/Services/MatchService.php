<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\MatchRepositoryInterface;

class MatchService
{
    public function __construct(private readonly MatchRepositoryInterface $matchRepository)
    {
    }

    public function refreshForUser(User $user): void
    {
        $myTeach = $user->userSkills()->where('type', 'teach')->pluck('skill_id')->all();
        $myLearn = $user->userSkills()->where('type', 'learn')->pluck('skill_id')->all();

        if (empty($myTeach) || empty($myLearn)) {
            return;
        }

        $relevantSkillIds = array_values(array_unique(array_merge($myTeach, $myLearn)));

        $candidates = User::query()
            ->where('id', '!=', $user->id)
            ->where('is_banned', false)
            ->whereHas('userSkills', function ($q) use ($relevantSkillIds) {
                $q->whereIn('skill_id', $relevantSkillIds);
            })
            ->with('userSkills')
            ->get();

        foreach ($candidates as $candidate) {
            $candidateTeach = $candidate->userSkills->where('type', 'teach')->pluck('skill_id')->all();
            $candidateLearn = $candidate->userSkills->where('type', 'learn')->pluck('skill_id')->all();

            $myTeachWantedByThem = array_values(array_intersect($myTeach, $candidateLearn));
            $theyTeachWantedByMe = array_values(array_intersect($candidateTeach, $myLearn));

            if (empty($myTeachWantedByThem) || empty($theyTeachWantedByMe)) {
                continue;
            }

            $mutual = array_values(array_unique(array_merge($myTeachWantedByThem, $theyTeachWantedByMe)));
            $denominator = max(count(array_unique(array_merge($myTeach, $myLearn))), 1);
            $score = min(100, (int) round((count($mutual) / $denominator) * 100));

            [$one, $two] = [$user->id, $candidate->id];
            if ($one > $two) {
                [$one, $two] = [$two, $one];
            }

            $this->matchRepository->createOrUpdatePair($one, $two, $score, $mutual);
        }
    }
}
