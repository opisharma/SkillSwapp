import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';

export default function ResetPassword({ email, token }) {
  const { data, setData, post, processing, errors } = useForm({
    token,
    email,
    password: '',
    password_confirmation: '',
  });

  const submit = (event) => {
    event.preventDefault();
    post(route('password.store'));
  };

  return (
    <AuthLayout
      title="Reset password"
      eyebrow="New password"
      heading="Choose a new password"
      description="Use a secure password you have not used before."
    >
      <Head title="Reset password" />

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={data.email}
            className="input"
            autoComplete="username"
            onChange={(event) => setData('email', event.target.value)}
          />
          {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email}</p> : null}
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={data.password}
            className="input"
            autoComplete="new-password"
            autoFocus
            onChange={(event) => setData('password', event.target.value)}
          />
          {errors.password ? <p className="mt-2 text-sm text-red-600">{errors.password}</p> : null}
        </div>

        <div>
          <label htmlFor="password_confirmation" className="mb-2 block text-sm font-medium text-slate-700">
            Confirm password
          </label>
          <input
            id="password_confirmation"
            type="password"
            value={data.password_confirmation}
            className="input"
            autoComplete="new-password"
            onChange={(event) => setData('password_confirmation', event.target.value)}
          />
          {errors.password_confirmation ? <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p> : null}
        </div>

        <div className="flex items-center justify-end">
          <button type="submit" className="btn-primary" disabled={processing}>
            Reset password
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}