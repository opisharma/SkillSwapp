<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\SkillMatch;
use App\Services\MessagingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    public function __construct(private readonly MessagingService $messagingService)
    {
    }

    public function index(Request $request, SkillMatch $match): Response
    {
        $this->authorize('view', $match);
        $this->messagingService->markConversationAsRead($match, $request->user());

        return Inertia::render('Chat/Index', [
            'match' => $match->load(['userOne', 'userTwo']),
            'messages' => MessageResource::collection($match->messages()->latest()->take(100)->get()->reverse()->values())->resolve(request()),
        ]);
    }

    public function store(StoreMessageRequest $request): RedirectResponse
    {
        $match = SkillMatch::query()->findOrFail($request->integer('match_id'));
        $this->authorize('view', $match);

        $this->messagingService->send($match, $request->user(), $request->string('body')->toString());

        return back()->with('success', 'Message sent.');
    }

    public function apiConversation(SkillMatch $match): JsonResponse
    {
        $this->authorize('view', $match);

        return response()->json([
            'data' => MessageResource::collection($match->messages()->latest()->take(100)->get()->reverse()->values())->resolve(request()),
        ]);
    }
}
