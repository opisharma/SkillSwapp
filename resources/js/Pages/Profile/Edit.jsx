import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function ProfileEdit({ user, status }) {
  const { props } = usePage();
  const { data, setData, post, processing, errors } = useForm({
    name: user.name || '',
    email: user.email || '',
    university: user.university || '',
    department: user.department || '',
    bio: user.bio || '',
    availability: user.availability || '',
    profile_photo: null,
  });

  const submit = (e) => {
    e.preventDefault();
    
    // Use post for file uploads (more reliable with CSRF)
    post(route('profile.update'), {
      forceFormData: true,
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {status && (
          <div className="rounded-md bg-green-50 p-4 text-green-800">
            {status}
          </div>
        )}
        
        <form onSubmit={submit} className="card grid gap-4 p-6">
          {/* Profile Photo Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Profile Photo</label>
            {user.profile_photo && (
              <div className="mb-4">
                <img src={`/storage/${user.profile_photo}`} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
              </div>
            )}
            <input 
              type="file" 
              className="input" 
              onChange={(e) => setData('profile_photo', e.target.files?.[0] ?? null)}
              accept="image/*"
            />
            {errors.profile_photo && <p className="text-red-500 text-sm mt-1">{errors.profile_photo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input 
              className={`input ${errors.name ? 'border-red-500' : ''}`}
              value={data.name} 
              onChange={(e) => setData('name', e.target.value)} 
              placeholder="Full name"
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              className={`input ${errors.email ? 'border-red-500' : ''}`}
              type="email" 
              value={data.email} 
              onChange={(e) => setData('email', e.target.value)} 
              placeholder="Email"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">University</label>
            <input 
              className="input" 
              value={data.university} 
              onChange={(e) => setData('university', e.target.value)} 
              placeholder="University" 
            />
            {errors.university && <p className="text-red-500 text-sm mt-1">{errors.university}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <input 
              className="input" 
              value={data.department} 
              onChange={(e) => setData('department', e.target.value)} 
              placeholder="Department" 
            />
            {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Availability</label>
            <input 
              className="input" 
              value={data.availability} 
              onChange={(e) => setData('availability', e.target.value)} 
              placeholder="Availability" 
            />
            {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
            <textarea 
              className="input min-h-28" 
              value={data.bio} 
              onChange={(e) => setData('bio', e.target.value)} 
              placeholder="Bio" 
            />
            {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
          </div>

          <button disabled={processing} className="btn-primary">
            {processing ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
