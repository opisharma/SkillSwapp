<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'session_id' => ['required', 'integer', 'exists:sessions,id'],
            'reviewed_user_id' => ['required', 'integer', 'exists:users,id'],
            'rating' => ['required', 'integer', 'between:1,5'],
            'review' => ['nullable', 'string', 'max:1200'],
        ];
    }
}
