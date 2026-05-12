<?php

namespace App\Http\Controllers;

use App\Http\Resources\SkillMatchResource;
use App\Repositories\Contracts\MatchRepositoryInterface;
use App\Services\MatchService;
use App\Services\SkillRecommendationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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

    public function index(Request $request): Response
    {
        try {
            $user = $request->user();

            $matches = $this->matchRepository->forUser($user->id);
            $recommendations = $this->skillRecommendationService->suggest($user);

            return Inertia::render('Matches/Index', [
                'matches' => SkillMatchResource::collection($matches)->resolve(request()),
                'skillRecommendations' => $recommendations->values()->all(),
            ]);
        } catch (\Exception $e) {
            Log::error('MatchController@index error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            // Return empty matches on error
            return Inertia::render('Matches/Index', [
                'matches' => [],
                'skillRecommendations' => [],
            ]);
        }
    }

    public function refresh(Request $request): RedirectResponse
    {
        $this->matchService->refreshForUser($request->user());

        return back()->with('success', 'Matches refreshed.');
    }

    public function apiIndex(Request $request): JsonResponse
    {
        $matches = $this->matchRepository->forUser($request->user()->id);

        return response()->json(SkillMatchResource::collection($matches));
    }
}
