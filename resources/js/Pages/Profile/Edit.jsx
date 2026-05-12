import React from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function ProfileEdit({ user }) {
  const { data, setData, post, processing } = useForm({
    _method: 'put',
    name: user.name || '',
    university: user.university || '',
    department: user.department || '',
    bio: user.bio || '',
    availability: user.availability || '',
    profile_photo: null,
  });

  const submit = (e) => {
    e.preventDefault();
    post('/profile');
  };

  return (
    <AppLayout>
      <form onSubmit={submit} className="card grid gap-4 p-6">
        <input className="input" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Full name" />
        <input className="input" value={data.university} onChange={(e) => setData('university', e.target.value)} placeholder="University" />
        <input className="input" value={data.department} onChange={(e) => setData('department', e.target.value)} placeholder="Department" />
        <input className="input" value={data.availability} onChange={(e) => setData('availability', e.target.value)} placeholder="Availability" />
        <textarea className="input min-h-28" value={data.bio} onChange={(e) => setData('bio', e.target.value)} placeholder="Bio" />
        <input type="file" className="input" onChange={(e) => setData('profile_photo', e.target.files?.[0] ?? null)} />
        <button disabled={processing} className="btn-primary">Save</button>
      </form>
    </AppLayout>
  );
}
