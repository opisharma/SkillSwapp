import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = (event) => {
    event.preventDefault();

    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <AuthLayout
      title="Log in"
      eyebrow="Welcome back"
      heading="Sign in to SkillSwap"
      description="Use your student account to find matches, schedule sessions, and keep your progress in one place."
    >
      <Head title="Log in" />

      {status ? (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {status}
        </div>
      ) : null}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="input"
            autoComplete="username"
            autoFocus
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
            name="password"
            value={data.password}
            className="input"
            autoComplete="current-password"
            onChange={(event) => setData('password', event.target.value)}
          />
          {errors.password ? <p className="mt-2 text-sm text-red-600">{errors.password}</p> : null}
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={data.remember}
            onChange={(event) => setData('remember', event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          Remember me
        </label>

        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="text-sm text-slate-600">
            New here?{' '}
            <Link href={route('register')} className="font-medium text-blue-700 hover:text-blue-800">
              Create account
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {canResetPassword ? (
              <Link href={route('password.request')} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Forgot password?
              </Link>
            ) : null}
            <button type="submit" className="btn-primary" disabled={processing}>
              Log in
            </button>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}