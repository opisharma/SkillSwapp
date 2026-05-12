<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserRepository implements UserRepositoryInterface
{
    public function findById(int $id): ?User
    {
        return User::query()->find($id);
    }

    public function search(array $filters, int $perPage = 12): LengthAwarePaginator
    {
        return User::query()
            ->when($filters['skill'] ?? null, function ($query, $skill) {
                $query->whereHas('userSkills.skill', fn ($q) => $q->where('name', 'like', "%{$skill}%"));
            })
            ->when($filters['university'] ?? null, fn ($query, $university) => $query->where('university', 'like', "%{$university}%"))
            ->when($filters['department'] ?? null, fn ($query, $department) => $query->where('department', 'like', "%{$department}%"))
            ->when($filters['availability'] ?? null, fn ($query, $availability) => $query->where('availability', 'like', "%{$availability}%"))
            ->paginate($perPage)
            ->withQueryString();
    }

    public function update(User $user, array $data): User
    {
        $user->update($data);

        return $user->refresh();
    }
}
