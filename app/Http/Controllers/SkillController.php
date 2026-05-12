<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSkillRequest;
use App\Http\Requests\StoreUserSkillRequest;
use App\Models\UserSkill;
use App\Repositories\Contracts\SkillRepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SkillController extends Controller
{
    public function __construct(private readonly SkillRepositoryInterface $skillRepository)
    {
    }

    public function index(): Response
    {
        return Inertia::render('Skills/Index', [
            'skills' => $this->skillRepository->all(),
            'userSkills' => auth()->user()->userSkills()->with('skill')->get(),
        ]);
    }

    public function store(StoreSkillRequest $request): RedirectResponse
    {
        $this->skillRepository->create($request->validated());

        return back()->with('success', 'Skill created.');
    }

    public function storeUserSkill(StoreUserSkillRequest $request): RedirectResponse
    {
        UserSkill::query()->updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'skill_id' => $request->integer('skill_id'),
                'type' => $request->string('type')->toString(),
            ],
            ['proficiency_level' => $request->string('proficiency_level')->toString()]
        );

        return back()->with('success', 'Skill mapping saved.');
    }

    public function destroyUserSkill(UserSkill $userSkill): RedirectResponse
    {
        abort_unless($userSkill->user_id === auth()->id(), 403);
        $userSkill->delete();

        return back()->with('success', 'User skill removed.');
    }
}
