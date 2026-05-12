<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SkillMatchResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $authId = $request->user()?->id;
        $peer = $this->user_one_id === $authId ? $this->userTwo : $this->userOne;

        return [
            'id' => $this->id,
            'match_percentage' => $this->match_percentage,
            'mutual_skills' => $this->mutual_skills ?? [],
            'peer' => [
                'id' => $peer?->id,
                'name' => $peer?->name,
                'university' => $peer?->university,
                'department' => $peer?->department,
            ],
        ];
    }
}
