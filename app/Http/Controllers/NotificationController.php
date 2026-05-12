<?php

namespace App\Http\Controllers;

use App\Models\Notification as UserNotification;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function __construct(private readonly NotificationService $notificationService)
    {
    }

    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Notifications/Index', [
            'notifications' => $this->notificationService->allForUser($user, 50)->all(),
            'unreadCount' => $this->notificationService->unreadCount($user),
        ]);
    }

    public function read(Request $request, UserNotification $notification): RedirectResponse
    {
        abort_unless((int) $notification->user_id === (int) $request->user()->id, 403);

        $this->notificationService->markRead($notification, $request->user());

        return back();
    }

    public function markAllRead(Request $request): RedirectResponse
    {
        $this->notificationService->markAllRead($request->user());

        return back();
    }
}