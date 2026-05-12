import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';

export default function VerifyEmail({ status }) {
  const { post, processing } = useForm();

  const resend = (event) => {
    event.preventDefault();
    post(route('verification.send'));
  };

  return (
    <AuthLayout
      title="Verify email"
      eyebrow="Email verification"
      heading="Verify your email address"
      description="We sent a verification link to your email address. Confirm it to unlock the full app."
    >
      <Head title="Verify email" />

      {status === 'verification-link-sent' ? (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          A new verification link has been sent.
        </div>
      ) : null}

      <div className="space-y-4 text-sm text-slate-600">
        <p>
          Before continuing, please verify your email address by clicking the link we just sent. If you did not receive it, we can send another one.
        </p>

        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={resend} className="btn-primary" disabled={processing}>
            Resend verification email
          </button>

          <Link href={route('logout')} method="post" as="button" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Log out
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}