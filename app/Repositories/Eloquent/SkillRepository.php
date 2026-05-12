<?php

namespace App\Repositories\Eloquent;

use App\Models\Skill;
use App\Repositories\Contracts\SkillRepositoryInterface;
use Illuminate\Support\Collection;

class SkillRepository implements SkillRepositoryInterface
{
    public function all(): Collection
    {
        return Skill::query()->orderBy('name')->get();
    }

    public function create(array $data): Skill
    {
        return Skill::query()->create($data);
    }

    public function findByName(string $name): ?Skill
    {
        return Skill::query()->whereRaw('lower(name) = ?', [strtolower($name)])->first();
    }
}
