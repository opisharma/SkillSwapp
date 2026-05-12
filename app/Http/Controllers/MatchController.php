<?php

namespace App\Http\Controllers;

use App\Http\Resources\SkillMatchResource;
use App\Repositories\Contracts\MatchRepositoryInterface;
use App\Services\MatchService;
use App\Services\SkillRecommendationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MatchController extends Controller
{
    public function __construct(
        private readonly MatchRepositoryInterface $matchRepository,
        private readonly MatchService $matchService,
        private readonly SkillRecommendationService $skillRecommendationService
    ) {
    }

    public function index(): Response
    {
        $matches = $this->matchRepository->forUser(auth()->id());

        return Inertia::render('Matches/Index', [
            'matches' => SkillMatchResource::collection($matches),
            'skillRecommendations' => $this->skillRecommendationService->suggest(auth()->user()),
        ]);
    }

    public function refresh(): RedirectResponse
    {
        $this->matchService->refreshForUser(auth()->user());

        return back()->with('success', 'Matches refreshed.');
    }

    public function apiIndex(): JsonResponse
    {
        $matches = $this->matchRepository->forUser(auth()->id());

        return response()->json(SkillMatchResource::collection($matches));
    }
}
