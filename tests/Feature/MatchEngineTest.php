<?php

namespace Tests\Feature;

use App\Models\Skill;
use App\Models\User;
use App\Models\UserSkill;
use App\Services\MatchService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MatchEngineTest extends TestCase
{
    use RefreshDatabase;

    public function test_mutual_skill_match_is_generated(): void
    {
        $a = User::factory()->create();
        $b = User::factory()->create();

        $python = Skill::query()->create(['name' => 'Python', 'category' => 'Programming']);
        $react = Skill::query()->create(['name' => 'React', 'category' => 'Web']);

        UserSkill::query()->create(['user_id' => $a->id, 'skill_id' => $python->id, 'type' => 'teach', 'proficiency_level' => 'advanced']);
        UserSkill::query()->create(['user_id' => $a->id, 'skill_id' => $react->id, 'type' => 'learn', 'proficiency_level' => 'beginner']);

        UserSkill::query()->create(['user_id' => $b->id, 'skill_id' => $react->id, 'type' => 'teach', 'proficiency_level' => 'advanced']);
        UserSkill::query()->create(['user_id' => $b->id, 'skill_id' => $python->id, 'type' => 'learn', 'proficiency_level' => 'beginner']);

        app(MatchService::class)->refreshForUser($a);

        $this->assertDatabaseCount('matches', 1);
    }
}
