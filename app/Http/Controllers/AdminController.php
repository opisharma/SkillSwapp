<?php

namespace App\Http\Controllers;

use App\Models\Session;
use App\Models\Skill;
use App\Models\SkillMatch;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function dashboard(): Response
    {
        abort_unless(auth()->user()?->is_admin, 403);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => User::query()->count(),
                'bannedUsers' => User::query()->where('is_banned', true)->count(),
                'totalSkills' => Skill::query()->count(),
                'totalMatches' => SkillMatch::query()->count(),
                'activeSessions' => Session::query()->whereIn('status', ['pending', 'accepted'])->count(),
            ],
            'recentUsers' => User::query()->latest()->limit(10)->get(),
        ]);
    }

    public function banUser(User $user): RedirectResponse
    {
        abort_unless(auth()->user()?->is_admin, 403);
        $user->update(['is_banned' => true]);

        return back()->with('success', 'User banned.');
    }

    public function unbanUser(User $user): RedirectResponse
    {
        abort_unless(auth()->user()?->is_admin, 403);
        $user->update(['is_banned' => false]);

        return back()->with('success', 'User unbanned.');
    }

    public function deleteSkill(Skill $skill): RedirectResponse
    {
        abort_unless(auth()->user()?->is_admin, 403);
        $skill->delete();

        return back()->with('success', 'Skill removed.');
    }
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                