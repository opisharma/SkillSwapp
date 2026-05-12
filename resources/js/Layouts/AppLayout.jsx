import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import NotificationBell from '../Components/NotificationBell';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Profile', href: '/profile' },
  { label: 'Skills', href: '/skills' },
  { label: 'Matches', href: '/matches' },
  { label: 'Sessions', href: '/sessions' },
];

export default function AppLayout({ children }) {
  const { url, props } = usePage();
  const user = props?.auth?.user;
  const notifications = props?.notifications ?? { unreadCount: 0, recent: [] };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="text-xl font-bold text-slate-900">SkillSwap</Link>
          <div className="flex items-center gap-3">
            <nav className="hidden gap-2 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    url.startsWith(item.href) ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {user ? (
              <NotificationBell
                userId={user.id}
                initialUnreadCount={notifications.unreadCount ?? 0}
                initialNotifications={notifications.recent ?? []}
              />
            ) : null}

            {user ? (
              <Link
                href={route('logout')}
                method="post"
                as="button"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
              >
                Logout
              </Link>
            ) : null}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
