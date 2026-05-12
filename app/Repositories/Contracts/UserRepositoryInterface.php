<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface UserRepositoryInterface
{
    public function findById(int $id): ?User;

    public function search(array $filters, int $perPage = 12): LengthAwarePaginator;

    public function update(User $user, array $data): User;
}
