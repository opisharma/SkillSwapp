import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';

export default function ForgotPassword({ status }) {
  const { data, setData, post, processing, errors } = useForm({ email: '' });

  const submit = (event) => {
    event.preventDefault();
    post(route('password.email'));
  };

  return (
    <AuthLayout
      title="Forgot password"
      eyebrow="Password reset"
      heading="Request a reset link"
      description="Enter the email attached to your account and we will send the reset link there."
    >
      <Head title="Forgot password" />

      {status ? <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{status}</div> : null}

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
            autoFocus
            onChange={(event) => setData('email', event.target.value)}
          />
          {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email}</p> : null}
        </div>

        <div className="flex items-center justify-end">
          <button type="submit" className="btn-primary" disabled={processing}>
            Email reset link
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}