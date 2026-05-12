<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'participant_user_id' => ['required', 'integer', 'exists:users,id'],
            'skill_id' => ['required', 'integer', 'exists:skills,id'],
            'meeting_link' => ['nullable', 'url', 'max:255'],
            'session_time' => ['required', 'date', 'after:now'],
        ];
    }
}
