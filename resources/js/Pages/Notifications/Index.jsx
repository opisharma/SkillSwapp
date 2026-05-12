import React from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function NotificationsIndex({ notifications = [], unreadCount = 0 }) {
  const markAllRead = () => {
    router.post(route('notifications.read-all'), {}, { preserveScroll: true });
  };

  return (
    <AppLayout>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="mt-1 text-sm text-slate-500">Message alerts and activity updates</p>
        </div>

        {unreadCount > 0 ? (
          <button type="button" onClick={markAllRead} className="btn-secondary">
            Mark all read
          </button>
        ) : null}
      </div>

      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Link
              key={notification.id}
              href={notification.link || '/notifications'}
              className={`card block p-5 transition hover:border-slate-300 hover:bg-slate-50 ${
                notification.read_at ? 'opacity-80' : 'border-blue-200 bg-blue-50/40'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-slate-900">{notification.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{notification.body || 'Open the conversation to read the message.'}</p>
                </div>
                <span className="text-xs text-slate-400">
                  {notification.created_at ? new Date(notification.created_at).toLocaleString() : ''}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="card p-8 text-center text-slate-500">
            You do not have any notifications yet.
          </div>
        )}
      </div>
    </AppLayout>
  );
}