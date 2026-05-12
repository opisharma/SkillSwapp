import React, { useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import EmptyState from '../../Components/EmptyState';

export default function MatchesPage(props) {
  const matches = Array.isArray(props.matches)
    ? props.matches
    : Array.isArray(props.matches?.data)
      ? props.matches.data
      : [];
  const skillRecommendations = Array.isArray(props.skillRecommendations)
    ? props.skillRecommendations
    : Array.isArray(props.skillRecommendations?.data)
      ? props.skillRecommendations.data
      : [];
  const { url } = usePage();

  useEffect(() => {
    console.log('Matches page mounted', {
      matchesCount: matches.length,
      recommendationsCount: skillRecommendations.length,
      matchesData: matches,
      recommendationsData: skillRecommendations,
    });
  }, [matches, skillRecommendations]);

  const handleRefresh = () => {
    try {
      router.post(route('matches.refresh'));
    } catch (error) {
      console.error('Error refreshing matches:', error);
    }
  };

  return (
    <AppLayout>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Match Suggestions</h1>
        <button 
          className="btn-secondary" 
          onClick={handleRefresh}
          disabled={false}
        >
          Refresh Matches
        </button>
      </div>

      {Array.isArray(matches) && matches.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {matches.map((item) => {
            if (!item || !item.peer) {
              console.warn('Skipping item without peer:', item);
              return null;
            }
            return (
              <div key={item.id} className="card p-5">
                <p className="text-lg font-bold text-slate-900">
                  {item.peer?.name || 'Unknown User'}
                </p>
                <p className="text-sm text-slate-500">
                  {item.peer?.university || 'N/A'} • {item.peer?.department || 'N/A'}
                </p>
                <p className="mt-3 text-sm font-semibold text-blue-700">
                  Match: {item.match_percentage || 0}%
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {Array.isArray(item.mutual_skills) && item.mutual_skills.length > 0 ? (
                    item.mutual_skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                      >
                        Skill #{skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No mutual skills</span>
                  )}
                </div>
                <Link 
                  href={`/chat/${item.id}`}
                  className="btn-primary mt-4"
                >
                  Open Chat
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState 
          title="No matches yet" 
          description="Add both teach and learn skills to unlock matching." 
        />
      )}

      <section className="card mt-6 p-5">
        <h2 className="text-lg font-semibold">AI Skill Recommendations (Optional)</h2>
        <p className="mt-1 text-sm text-slate-500">
          You can replace this heuristic with OpenAI/Gemini API suggestions.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {Array.isArray(skillRecommendations) && skillRecommendations.length > 0 ? (
            skillRecommendations.map((skill) => (
              <span 
                key={skill.id} 
                className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
              >
                {skill.name}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400">No recommendations available</span>
          )}
        </div>
      </section>
    </AppLayout>
  );
}
