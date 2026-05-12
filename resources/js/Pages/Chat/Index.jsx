import React from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function ChatPage({ match, messages = [] }) {
  const { data, setData, post, reset } = useForm({ match_id: match.id, body: '' });

  const send = (e) => {
    e.preventDefault();
    post('/messages', {
      preserveScroll: true,
      onSuccess: () => reset('body'),
    });
  };

  return (
    <AppLayout>
      <div className="card flex h-[70vh] flex-col p-4">
        <div className="border-b border-slate-100 pb-3">
          <h1 className="text-lg font-bold text-slate-900">Conversation</h1>
          <p className="text-sm text-slate-500">Matched users chat</p>
        </div>
        <div className="mt-3 flex-1 space-y-2 overflow-y-auto">
          {messages.map((m) => (
            <div key={m.id} className="rounded-xl bg-slate-50 p-3 text-sm">
              <p className="text-slate-800">{m.body}</p>
              <p className="mt-1 text-xs text-slate-500">{new Date(m.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <form onSubmit={send} className="mt-3 flex gap-2">
          <input className="input" value={data.body} onChange={(e) => setData('body', e.target.value)} placeholder="Type a message" />
          <button className="btn-primary">Send</button>
        </form>
      </div>
    </AppLayout>
  );
}
