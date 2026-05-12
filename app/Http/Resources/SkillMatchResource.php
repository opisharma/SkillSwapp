<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SkillMatchResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $authId = $request->user()?->id;
        $userOneId = (int) $this->user_one_id;
        $userTwoId = (int) $this->user_two_id;
        
        // Determine which is the peer (the other user)
        $peer = null;
        if ($authId !== null && $userOneId === (int) $authId) {
            $peer = $this->userTwo ?? null;
        } elseif ($authId !== null && $userTwoId === (int) $authId) {
            $peer = $this->userOne ?? null;
        } else {
            $peer = $this->userOne ?? $this->userTwo ?? null;
        }

        return [
            'id' => $this->id,
            'match_percentage' => $this->match_percentage ?? 0,
            'mutual_skills' => $this->mutual_skills ?? [],
            'peer' => $peer ? [
                'id' => $peer->id,
                'name' => $peer->name,
                'university' => $peer->university,
                'department' => $peer->department,
                'profile_photo' => $peer->profile_photo,
            ] : null,
        ];
    }
}
