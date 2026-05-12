import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const submit = (event) => {
    event.preventDefault();

    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <AuthLayout
      title="Register"
      eyebrow="Join SkillSwap"
      heading="Create your student account"
      description="Sign up to share what you know, find the right peers, and keep your learning workflow organized."
    >
      <Head title="Register" />

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            value={data.name}
            className="input"
            autoComplete="name"
            autoFocus
            required
            onChange={(event) => setData('name', event.target.value)}
          />
          {errors.name ? <p className="mt-2 text-sm text-red-600">{errors.name}</p> : null}
        </div>

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
            required
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
            autoComplete="new-password"
            required
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
            name="password_confirmation"
            value={data.password_confirmation}
            className="input"
            autoComplete="new-password"
            required
            onChange={(event) => setData('password_confirmation', event.target.value)}
          />
          {errors.password_confirmation ? <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p> : null}
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link href={route('login')} className="font-medium text-blue-700 hover:text-blue-800">
              Sign in
            </Link>
          </div>

          <button type="submit" className="btn-primary" disabled={processing}>
            Create account
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}