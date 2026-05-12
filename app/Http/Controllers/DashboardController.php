<?php

namespace App\Http\Controllers;

use App\Models\Session;
use App\Models\SkillMatch;
use App\Models\UserSkill;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        return Inertia::render('Dashboard/Index', [
            'stats' => [
                'teachSkills' => UserSkill::query()->where('user_id', $user->id)->where('type', 'teach')->count(),
                'learnSkills' => UserSkill::query()->where('user_id', $user->id)->where('type', 'learn')->count(),
                'matches' => SkillMatch::query()->where('user_one_id', $user->id)->orWhere('user_two_id', $user->id)->count(),
                'sessions' => Session::query()->where('host_user_id', $user->id)->orWhere('participant_user_id', $user->id)->count(),
            ],
            'upcomingSessions' => Session::query()
                ->with(['host', 'participant', 'skill'])
                ->where(fn ($q) => $q->where('host_user_id', $user->id)->orWhere('participant_user_id', $user->id))
                ->where('session_time', '>=', now())
                ->orderBy('session_time')
                ->limit(5)
                ->get(),
        ]);
    }
}
