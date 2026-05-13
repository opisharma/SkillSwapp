import React, { useEffect, useState } from 'react';
import { Link, router } from '@inertiajs/react';

export default function NotificationBell({ userId, initialUnreadCount = 0, initialNotifications = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [notifications, setNotifications] = useState(initialNotifications);

  useEffect(() => {
    setUnreadCount(initialUnreadCount);
  }, [initialUnreadCount]);

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  useEffect(() => {
    if (!userId || !window.Echo) {
      return undefined;
    }

    const channel = window.Echo.private(`users.${userId}`);

    channel.listen('MessageNotificationCreated', (event) => {
      const notification = event?.notification ?? event;

      if (!notification?.id) {
        return;
      }

      setUnreadCount((current) => current + 1);
      setNotifications((current) => [notification, ...current].slice(0, 5));
    });

    return () => {
      window.Echo.leave(`users.${userId}`);
    };
  }, [userId]);

  // Fallback: listen for global chat events and create a notification when addressed to this user
  useEffect(() => {
    if (!userId) return undefined;

    const handler = (e) => {
      const payload = e?.detail || null;
      if (!payload || payload.receiver_id !== userId) return;

      const notification = {
        id: `msg-${payload.id}`,
        user_id: userId,
        type: 'message.received',
        title: `New message from ${payload.sender?.name ?? 'Someone'}`,
        body: payload.body || '',
        data: {
          match_id: payload.match_id,
          message_id: payload.id,
          sender_id: payload.sender_id,
          sender_name: payload.sender?.name,
        },
        link: `/chat/${payload.match_id}`,
        read_at: null,
        created_at: payload.created_at,
      };

      setUnreadCount((current) => current + 1);
      setNotifications((current) => [notification, ...current].slice(0, 5));
    };

    window.addEventListener('chat:message', handler);
    return () => window.removeEventListener('chat:message', handler);
  }, [userId]);

  const markAllRead = () => {
    router.post(route('notifications.read-all'), {}, {
      preserveScroll: true,
      onSuccess: () => {
        setUnreadCount(0);
      },
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="relative rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
        aria-label="Notifications"
      >
        <span className="text-base">🔔</span>
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-semibold text-white">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-30 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Notifications</p>
              <p className="text-xs text-slate-500">Live message alerts</p>
            </div>
            <button type="button" className="text-xs font-medium text-blue-700 hover:text-blue-800" onClick={markAllRead}>
              Mark all read
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.link || '/notifications'}
                  className={`block border-b border-slate-100 px-4 py-3 transition last:border-b-0 hover:bg-slate-50 ${
                    notification.read_at ? 'opacity-75' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{notification.body || 'Open chat to read the message.'}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {notification.created_at ? new Date(notification.created_at).toLocaleString() : ''}
                  </p>
                </Link>
              ))
            ) : (
              <div className="px-4 py-6 text-sm text-slate-500">No notifications yet.</div>
            )}
          </div>

          <div className="border-t border-slate-100 px-4 py-3">
            <Link href="/notifications" className="text-sm font-medium text-blue-700 hover:text-blue-800" onClick={() => setIsOpen(false)}>
              View all notifications
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}