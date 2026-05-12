import React from 'react';

export default function AuthLayout({ title, eyebrow, heading, description, children }) {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden rounded-[2rem] border border-white/70 bg-white/70 p-8 shadow-soft backdrop-blur lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">SkillSwap</p>
              <h1 className="mt-4 text-4xl font-black leading-tight text-slate-900">Learn faster with peers who actually get your goals.</h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                A focused space for students to exchange practical skills, schedule sessions, and build momentum together.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {['Match by skill', 'Book sessions', 'Share feedback'].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm font-medium text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6 sm:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">{eyebrow}</p>
              <h2 className="mt-2 text-3xl font-black text-slate-900">{heading}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
            </div>

            <title>{title}</title>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}