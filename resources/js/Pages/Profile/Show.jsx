import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function ProfileShow({ user }) {
  return (
    <AppLayout>
      <div className="card p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-6">
            {user.profile_photo && (
              <img 
                src={`/storage/${user.profile_photo}`} 
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
              <p className="text-sm text-slate-500">{user.university || 'University not set'} • {user.department || 'Department not set'}</p>
            </div>
          </div>
          <Link href="/profile/edit" className="btn-secondary">Edit Profile</Link>
        </div>
        <p className="mt-5 text-slate-700">{user.bio || 'No bio yet.'}</p>
        <div className="mt-4 text-sm text-slate-500">Availability: {user.availability || 'Not set'}</div>
      </div>
    </AppLayout>
  );
}
