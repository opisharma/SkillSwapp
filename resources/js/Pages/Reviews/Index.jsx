import React from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function ReviewsPage({ targetUser, reviews, averageRating, totalReviews }) {
  const { data, setData, post } = useForm({
    session_id: '',
    reviewed_user_id: targetUser.id,
    rating: 5,
    review: '',
  });

  return (
    <AppLayout>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h1 className="text-xl font-bold">Reviews for {targetUser.name}</h1>
          <p className="mt-1 text-sm text-slate-500">Average: {averageRating || 0}/5 • {totalReviews} total</p>
          <div className="mt-4 space-y-3">
            {reviews?.data?.map((row) => (
              <div key={row.id} className="rounded-xl border border-slate-100 p-3">
                <p className="font-semibold">{row.rating}/5</p>
                <p className="text-sm text-slate-600">{row.review || 'No text review'}</p>
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); post('/reviews'); }} className="card grid gap-3 p-5">
          <h2 className="text-lg font-semibold">Leave a Review</h2>
          <input className="input" placeholder="Session ID" value={data.session_id} onChange={(e) => setData('session_id', e.target.value)} />
          <input className="input" type="number" min="1" max="5" value={data.rating} onChange={(e) => setData('rating', e.target.value)} />
          <textarea className="input min-h-24" value={data.review} onChange={(e) => setData('review', e.target.value)} placeholder="Share your feedback" />
          <button className="btn-primary">Submit</button>
        </form>
      </div>
    </AppLayout>
  );
}
