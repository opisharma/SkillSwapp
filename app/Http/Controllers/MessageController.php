<?php

namespace App\Http\Controllers;

use App\Events\UserStoppedTyping;
use App\Events\UserTyping;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Http\Resources\SkillMatchResource;
use App\Models\SkillMatch;
use App\Repositories\Contracts\MatchRepositoryInterface;
use App\Services\MessagingService;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    public function __construct(
        private readonly MatchRepositoryInterface $matchRepository,
        private readonly MessagingService $messagingService,
        private readonly NotificationService $notificationService
    ) {
    }

    public function index(Request $request, SkillMatch $match): Response
    {
        $this->authorize('view', $match);
        $this->messagingService->markConversationAsRead($match, $request->user());
        $this->notificationService->markMatchNotificationsRead($request->user(), $match);

        $matches = $this->matchRepository->forUser($request->user()->id);
        $resolvedMatch = $match->load(['userOne', 'userTwo']);
        $messages = MessageResource::collection(
            $match->messages()->latest()->take(100)->get()->reverse()->values()
        )->resolve(request());

        return Inertia::render('Chat/Index', [
            'match' => $resolvedMatch,
            'initialMatch' => $resolvedMatch,
            'messages' => $messages,
            'initialMessages' => $messages,
            'matches' => SkillMatchResource::collection($matches)->resolve(request()),
        ]);
    }

    public function store(StoreMessageRequest $request): RedirectResponse
    {
        $match = SkillMatch::query()->with(['userOne', 'userTwo'])->findOrFail($request->integer('match_id'));
        $this->authorize('view', $match);

        $message = $this->messagingService->send($match, $request->user(), $request->string('body')->toString());
        $receiver = $match->user_one_id === $request->user()->id ? $match->userTwo : $match->userOne;

        if ($receiver) {
            $this->notificationService->notifyMessageReceived($receiver, $request->user(), $match, $message);
        }

        return back()->with('success', 'Message sent.');
    }

    /**
     * Get messages for a conversation (API endpoint)
     */
    public function apiConversation(Request $request, SkillMatch $match): JsonResponse
    {
        $this->authorize('view', $match);

        // Mark all messages as read
        $this->messagingService->markConversationAsRead($match, $request->user());

        $messages = $match
            ->messages()
            ->with(['sender', 'receiver'])
            ->latest()
            ->take(50)
            ->get()
            ->reverse()
            ->values();

        return response()->json([
            'data' => MessageResource::collection($messages)->resolve(request()),
        ]);
    }

    /**
     * Store message via API (for real-time SPA)
     */
    public function apiStore(Request $request): JsonResponse
    {
        $match = SkillMatch::query()->with(['userOne', 'userTwo'])->findOrFail($request->integer('match_id'));
        $this->authorize('view', $match);

        $validated = $request->validate([
            'match_id' => ['required', 'integer', 'exists:matches,id'],
            'body' => ['required', 'string', 'max:5000', 'min:1'],
        ]);

        $message = $this->messagingService->send($match, $request->user(), $validated['body']);
        $receiver = $match->user_one_id === $request->user()->id ? $match->userTwo : $match->userOne;

        if ($receiver) {
            $this->notificationService->notifyMessageReceived($receiver, $request->user(), $match, $message);
        }

        return response()->json(MessageResource::make($message)->resolve(request()), 201);
    }

    /**
     * Emit typing indicator
     */
    public function emitTyping(Request $request): JsonResponse
    {
        $request->validate([
            'match_id' => ['required', 'integer', 'exists:matches,id'],
        ]);

        $match = SkillMatch::findOrFail($request->integer('match_id'));
        $this->authorize('view', $match);

        UserTyping::dispatch($request->user(), $match->id);

        return response()->json(['success' => true]);
    }

    /**
     * Emit stopped typing indicator
     */
    public function emitStoppedTyping(Request $request): JsonResponse
    {
        $request->validate([
            'match_id' => ['required', 'integer', 'exists:matches,id'],
        ]);

        $match = SkillMatch::findOrFail($request->integer('match_id'));
        $this->authorize('view', $match);

        UserStoppedTyping::dispatch($request->user(), $match->id);

        return response()->json(['success' => true]);
    }
}
