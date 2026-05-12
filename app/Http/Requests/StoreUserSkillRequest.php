<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserSkillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'skill_id' => ['required', 'integer', 'exists:skills,id'],
            'type' => ['required', 'in:teach,learn'],
            'proficiency_level' => ['required', 'in:beginner,intermediate,advanced'],
        ];
    }
}
