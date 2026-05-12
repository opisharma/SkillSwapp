<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'university' => $this->university,
            'department' => $this->department,
            'bio' => $this->bio,
            'availability' => $this->availability,
            'profile_photo' => $this->profile_photo,
            'average_rating' => round((float) $this->receivedReviews()->avg('rating'), 1),
            'total_reviews' => $this->receivedReviews()->count(),
        ];
    }
}
