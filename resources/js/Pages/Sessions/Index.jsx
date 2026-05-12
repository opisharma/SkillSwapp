import React from 'react';
import { useForm, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function SessionsPage({ sessions }) {
  const { data, setData, post, processing } = useForm({
    participant_user_id: '',
    skill_id: '',
    meeting_link: '',
    session_time: '',
  });

  return (
    <AppLayout>
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={(e) => { e.preventDefault(); post('/sessions'); }} className="card grid gap-3 p-5">
          <h2 className="text-lg font-semibold">Schedule Session</h2>
          <input className="input" placeholder="Participant User ID" value={data.participant_user_id} onChange={(e) => setData('participant_user_id', e.target.value)} />
          <input className="input" placeholder="Skill ID" value={data.skill_id} onChange={(e) => setData('skill_id', e.target.value)} />
          <input className="input" placeholder="Meeting Link" value={data.meeting_link} onChange={(e) => setData('meeting_link', e.target.value)} />
          <input className="input" type="datetime-local" value={data.session_time} onChange={(e) => setData('session_time', e.target.value)} />
          <button disabled={processing} className="btn-primary">Create Session</button>
        </form>

        <div className="card p-5">
          <h2 className="text-lg font-semibold">My Sessions</h2>
          <div className="mt-3 space-y-3">
            {sessions?.data?.map((session) => (
              <div key={session.id} className="rounded-xl border border-slate-100 p-3">
                <p className="font-semibold">{session.skill?.name || `Skill #${session.skill_id}`}</p>
                <p className="text-sm text-slate-500">{new Date(session.session_time).toLocaleString()} • {session.status}</p>
                <div className="mt-2 flex gap-2">
                  <button className="btn-secondary" onClick={() => router.patch(`/sessions/${session.id}/status`, { status: 'accepted' })}>Accept</button>
                  <button className="btn-secondary" onClick={() => router.patch(`/sessions/${session.id}/status`, { status: 'rejected' })}>Reject</button>
                  <button className="btn-secondary" onClick={() => router.patch(`/sessions/${session.id}/status`, { status: 'completed' })}>Complete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
