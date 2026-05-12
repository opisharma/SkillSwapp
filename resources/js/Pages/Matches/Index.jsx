import React from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import EmptyState from '../../Components/EmptyState';

export default function MatchesPage({ matches = [], skillRecommendations = [] }) {
  return (
    <AppLayout>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Match Suggestions</h1>
        <button className="btn-secondary" onClick={() => router.post('/matches/refresh')}>Refresh Matches</button>
      </div>

      {matches.length === 0 ? (
        <EmptyState title="No matches yet" description="Add both teach and learn skills to unlock matching." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {matches.map((item) => (
            <div key={item.id} className="card p-5">
              <p className="text-lg font-bold text-slate-900">{item.peer?.name}</p>
              <p className="text-sm text-slate-500">{item.peer?.university} • {item.peer?.department}</p>
              <p className="mt-3 text-sm font-semibold text-blue-700">Match: {item.match_percentage}%</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.mutual_skills?.map((skill) => (
                  <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">Skill #{skill}</span>
                ))}
              </div>
              <Link href={`/chat/${item.id}`} className="btn-primary mt-4">Open Chat</Link>
            </div>
          ))}
        </div>
      )}

      <section className="card mt-6 p-5">
        <h2 className="text-lg font-semibold">AI Skill Recommendations (Optional)</h2>
        <p className="mt-1 text-sm text-slate-500">You can replace this heuristic with OpenAI/Gemini API suggestions.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {skillRecommendations.map((skill) => (
            <span key={skill.id} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">{skill.name}</span>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
