<?php

namespace App\Repositories\Contracts;

use App\Models\Skill;
use Illuminate\Support\Collection;

interface SkillRepositoryInterface
{
    public function all(): Collection;

    public function create(array $data): Skill;

    public function findByName(string $name): ?Skill;
}
