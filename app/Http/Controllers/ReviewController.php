<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(User $user): Response
    {
        $reviews = Review::query()
            ->with(['reviewer', 'session'])
            ->where('reviewed_user_id', $user->id)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Reviews/Index', [
            'targetUser' => $user,
            'reviews' => $reviews,
            'averageRating' => round((float) $user->receivedReviews()->avg('rating'), 1),
            'totalReviews' => $user->receivedReviews()->count(),
        ]);
    }

    public function store(StoreReviewRequest $request): RedirectResponse
    {
        Review::query()->create([
            'session_id' => $request->integer('session_id'),
            'reviewer_id' => $request->user()->id,
            'reviewed_user_id' => $request->integer('reviewed_user_id'),
            'rating' => $request->integer('rating'),
            'review' => $request->input('review'),
        ]);

        return back()->with('success', 'Review submitted.');
    }

    public function apiIndex(User $user): JsonResponse
    {
        return response()->json([
            'average_rating' => round((float) $user->receivedReviews()->avg('rating'), 1),
            'total_reviews' => $user->receivedReviews()->count(),
            'items' => $user->receivedReviews()->with('reviewer')->latest()->get(),
        ]);
    }
}
