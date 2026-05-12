<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'match_id' => ['required', 'integer', 'exists:matches,id'],
            'body' => ['required', 'string', 'max:5000'],
        ];
    }
}
