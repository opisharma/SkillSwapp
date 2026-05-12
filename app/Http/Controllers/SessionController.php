<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSessionRequest;
use App\Http\Requests\UpdateSessionStatusRequest;
use App\Models\Session;
use App\Services\SessionService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SessionController extends Controller
{
    public function __construct(private readonly SessionService $sessionService)
    {
    }

    public function index(): Response
    {
        $sessions = Session::query()
            ->with(['host', 'participant', 'skill'])
            ->where(fn ($q) => $q->where('host_user_id', auth()->id())->orWhere('participant_user_id', auth()->id()))
            ->latest('session_time')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Sessions/Index', [
            'sessions' => $sessions,
        ]);
    }

    public function store(StoreSessionRequest $request): RedirectResponse
    {
        $this->sessionService->create($request->user(), $request->validated());

        return back()->with('success', 'Session invitation created.');
    }

    public function updateStatus(UpdateSessionStatusRequest $request, Session $session): RedirectResponse
    {
        $this->authorize('updateStatus', $session);
        $this->sessionService->changeStatus($session, $request->string('status')->toString());

        return back()->with('success', 'Session status updated.');
    }
}
