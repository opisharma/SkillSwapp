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

        // Get latest message
        $latestMessage = $this->messages()
            ->latest('created_at')
            ->first();

        return [
            'id' => $this->id,
            'user_one_id' => $this->user_one_id,
            'user_two_id' => $this->user_two_id,
            'match_percentage' => $this->match_percentage ?? 0,
            'mutual_skills' => $this->mutual_skills ?? [],
            'created_at' => $this->created_at?->toIso8601String(),
            'userOne' => $this->userOne ? [
                'id' => $this->userOne->id,
                'name' => $this->userOne->name,
                'profile_photo' => $this->userOne->profile_photo,
            ] : null,
            'userTwo' => $this->userTwo ? [
                'id' => $this->userTwo->id,
                'name' => $this->userTwo->name,
                'profile_photo' => $this->userTwo->profile_photo,
            ] : null,
            'peer' => $peer ? [
                'id' => $peer->id,
                'name' => $peer->name,
                'university' => $peer->university,
                'department' => $peer->department,
                'profile_photo' => $peer->profile_photo,
            ] : null,
            'latestMessage' => $latestMessage ? [
                'id' => $latestMessage->id,
                'body' => $latestMessage->body,
                'sender_id' => $latestMessage->sender_id,
                'created_at' => $latestMessage->created_at?->toIso8601String(),
            ] : null,
        ];
    }
}

