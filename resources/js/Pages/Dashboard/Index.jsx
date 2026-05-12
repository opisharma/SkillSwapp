import React from 'react';
import AppLayout from '../../Layouts/AppLayout';
import StatCard from '../../Components/StatCard';

export default function DashboardPage({ stats, upcomingSessions = [] }) {
  return (
    <AppLayout>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Skills I Teach" value={stats.teachSkills} />
        <StatCard title="Skills I Learn" value={stats.learnSkills} />
        <StatCard title="Total Matches" value={stats.matches} />
        <StatCard title="Sessions" value={stats.sessions} />
      </div>
      <section className="card mt-6 p-5">
        <h2 className="text-lg font-semibold text-slate-900">Upcoming Sessions</h2>
        <div className="mt-4 divide-y divide-slate-100">
          {upcomingSessions.length === 0 ? (
            <p className="py-6 text-sm text-slate-500">No upcoming sessions yet.</p>
          ) : (
            upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between py-3">
                <p className="font-medium text-slate-800">{session.skill?.name}</p>
                <p className="text-sm text-slate-500">{new Date(session.session_time).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </AppLayout>
  );
}
