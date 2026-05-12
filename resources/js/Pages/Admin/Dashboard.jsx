import React from 'react';
import AppLayout from '../../Layouts/AppLayout';
import StatCard from '../../Components/StatCard';

export default function AdminDashboard({ stats, recentUsers = [] }) {
  return (
    <AppLayout>
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Users" value={stats.totalUsers} />
        <StatCard title="Banned" value={stats.bannedUsers} />
        <StatCard title="Skills" value={stats.totalSkills} />
        <StatCard title="Matches" value={stats.totalMatches} />
        <StatCard title="Active Sessions" value={stats.activeSessions} />
      </div>
      <section className="card mt-6 p-5">
        <h2 className="text-lg font-semibold">Recent Users</h2>
        <div className="mt-3 divide-y divide-slate-100">
          {recentUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between py-2 text-sm">
              <span>{user.name}</span>
              <span className="text-slate-500">{user.email}</span>
            </div>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
