import React from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function ChatPage({ match, messages = [] }) {
  const conversationMessages = Array.isArray(messages)
    ? messages
    : Array.isArray(messages?.data)
      ? messages.data
      : [];
  const chatMatch = match?.data ?? match;
  const { data, setData, post, reset } = useForm({ match_id: chatMatch?.id ?? null, body: '' });

  if (!chatMatch?.id) {
    return (
      <AppLayout>
        <div className="card p-6">
          <h1 className="text-lg font-bold text-slate-900">Conversation unavailable</h1>
          <p className="mt-2 text-sm text-slate-500">
            The match data could not be loaded.
          </p>
        </div>
      </AppLayout>
    );
  }

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
          {conversationMessages.length > 0 ? conversationMessages.map((m) => (
            <div key={m.id} className="rounded-xl bg-slate-50 p-3 text-sm">
              <p className="text-slate-800">{m.body}</p>
              <p className="mt-1 text-xs text-slate-500">{new Date(m.created_at).toLocaleString()}</p>
            </div>
          )) : (
            <p className="py-6 text-sm text-slate-500">No messages yet. Start the conversation below.</p>
          )}
        </div>
        <form onSubmit={send} className="mt-3 flex gap-2">
          <input className="input" value={data.body} onChange={(e) => setData('body', e.target.value)} placeholder="Type a message" />
          <button className="btn-primary">Send</button>
        </form>
      </div>
    </AppLayout>
  );
}
