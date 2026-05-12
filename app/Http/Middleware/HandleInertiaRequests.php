<?php

namespace App\Http\Middleware;

use App\Models\Notification as UserNotification;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $notifications = [];
        $unreadCount = 0;

        if ($request->user()) {
            $unreadCount = UserNotification::query()
                ->where('user_id', $request->user()->id)
                ->whereNull('read_at')
                ->count();

            $notifications = UserNotification::query()
                ->where('user_id', $request->user()->id)
                ->latest()
                ->limit(5)
                ->get()
                ->map(function (UserNotification $notification): array {
                    return [
                        'id' => $notification->id,
                        'type' => $notification->type,
                        'title' => $notification->title,
                        'body' => $notification->body,
                        'data' => $notification->data ?? [],
                        'link' => data_get($notification->data, 'link'),
                        'read_at' => $notification->read_at?->toIso8601String(),
                        'created_at' => $notification->created_at?->toIso8601String(),
                    ];
                })
                ->values()
                ->all();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'notifications' => [
                'unreadCount' => $unreadCount,
                'recent' => $notifications,
            ],
            'csrf_token' => csrf_token(),
        ];
    }
}
