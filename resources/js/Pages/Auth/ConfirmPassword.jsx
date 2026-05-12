import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';

export default function ConfirmPassword() {
  const { data, setData, post, processing, errors } = useForm({ password: '' });

  const submit = (event) => {
    event.preventDefault();
    post(route('password.confirm'));
  };

  return (
    <AuthLayout
      title="Confirm password"
      eyebrow="Security check"
      heading="Confirm your password"
      description="Re-enter your password to continue with this protected action."
    >
      <Head title="Confirm password" />

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={data.password}
            className="input"
            autoComplete="current-password"
            autoFocus
            onChange={(event) => setData('password', event.target.value)}
          />
          {errors.password ? <p className="mt-2 text-sm text-red-600">{errors.password}</p> : null}
        </div>

        <div className="flex items-center justify-end">
          <button type="submit" className="btn-primary" disabled={processing}>
            Confirm
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}