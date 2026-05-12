import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

export default function SearchFilters({ initial = {} }) {
  const [filters, setFilters] = useState({
    skill: initial.skill ?? '',
    university: initial.university ?? '',
    department: initial.department ?? '',
    availability: initial.availability ?? '',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      router.get('/dashboard', filters, {
        preserveState: true,
        replace: true,
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <div className="card grid gap-3 p-4 md:grid-cols-4">
      <input className="input" placeholder="Skill" value={filters.skill} onChange={(e) => setFilters((p) => ({ ...p, skill: e.target.value }))} />
      <input className="input" placeholder="University" value={filters.university} onChange={(e) => setFilters((p) => ({ ...p, university: e.target.value }))} />
      <input className="input" placeholder="Department" value={filters.department} onChange={(e) => setFilters((p) => ({ ...p, department: e.target.value }))} />
      <input className="input" placeholder="Availability" value={filters.availability} onChange={(e) => setFilters((p) => ({ ...p, availability: e.target.value }))} />
    </div>
  );
}
