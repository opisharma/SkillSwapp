import React from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function SkillsPage({ skills = [], userSkills = [] }) {
  const { data, setData, post, processing } = useForm({ skill_id: '', type: 'teach', proficiency_level: 'beginner' });

  const submit = (e) => {
    e.preventDefault();
    post('/user-skills', { preserveScroll: true });
  };

  return (
    <AppLayout>
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={submit} className="card space-y-3 p-5">
          <h2 className="text-lg font-semibold">Add Skill</h2>
          <select className="input" value={data.skill_id} onChange={(e) => setData('skill_id', e.target.value)}>
            <option value="">Select skill</option>
            {skills.map((skill) => <option key={skill.id} value={skill.id}>{skill.name}</option>)}
          </select>
          <select className="input" value={data.type} onChange={(e) => setData('type', e.target.value)}>
            <option value="teach">Teach</option>
            <option value="learn">Learn</option>
          </select>
          <select className="input" value={data.proficiency_level} onChange={(e) => setData('proficiency_level', e.target.value)}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <button disabled={processing} className="btn-primary">Save Skill</button>
        </form>
        <div className="card p-5">
          <h2 className="text-lg font-semibold">My Skills</h2>
          <div className="mt-3 space-y-2">
            {userSkills.map((row) => (
              <div key={row.id} className="rounded-xl border border-slate-100 p-3 text-sm">
                <p className="font-semibold text-slate-800">{row.skill?.name}</p>
                <p className="text-slate-500">{row.type} • {row.proficiency_level}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
