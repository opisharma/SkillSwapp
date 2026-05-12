import React from 'react';
import { Link } from '@inertiajs/react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[linear-gradient(130deg,#e2e8f0_0%,#f8fafc_45%,#dbeafe_100%)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-12 lg:flex-row lg:items-center lg:gap-20">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Student Skill Exchange</p>
          <h1 className="mt-4 text-5xl font-black leading-tight text-slate-900">Teach what you know. Learn what you need.</h1>
          <p className="mt-6 text-lg text-slate-600">SkillSwap helps students discover peer mentors, exchange skills, and grow faster through practical sessions.</p>
          <div className="mt-8 flex gap-3">
            <Link href="/register" className="btn-primary">Create account</Link>
            <Link href="/login" className="btn-secondary">Sign in</Link>
          </div>
        </div>
        <div className="card w-full max-w-md p-6">
          <h2 className="text-xl font-bold text-slate-900">Why SkillSwap?</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>Mutual skill matching engine</li>
            <li>Session scheduling and peer reviews</li>
            <li>Real conversation flow between matches</li>
            <li>Student-first responsive experience</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
