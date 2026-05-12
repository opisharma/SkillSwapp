<?php

namespace Database\Seeders;

use App\Models\Skill;
use App\Models\User;
use App\Models\UserSkill;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@skillswap.test',
            'is_admin' => true,
        ]);

        $users = User::factory()->count(20)->create();

        $skills = collect([
            ['name' => 'Python', 'category' => 'Programming'],
            ['name' => 'Laravel', 'category' => 'Web Development'],
            ['name' => 'React', 'category' => 'Web Development'],
            ['name' => 'Data Structures', 'category' => 'Computer Science'],
            ['name' => 'UI Design', 'category' => 'Design'],
            ['name' => 'Public Speaking', 'category' => 'Communication'],
            ['name' => 'Statistics', 'category' => 'Math'],
            ['name' => 'Machine Learning', 'category' => 'AI'],
        ])->map(fn ($row) => Skill::query()->firstOrCreate($row));

        $users->each(function (User $user) use ($skills): void {
            $teach = $skills->random(2);
            $learn = $skills->diff($teach)->random(2);

            foreach ($teach as $skill) {
                UserSkill::query()->firstOrCreate([
                    'user_id' => $user->id,
                    'skill_id' => $skill->id,
                    'type' => 'teach',
                ], [
                    'proficiency_level' => fake()->randomElement(['intermediate', 'advanced']),
                ]);
            }

            foreach ($learn as $skill) {
                UserSkill::query()->firstOrCreate([
                    'user_id' => $user->id,
                    'skill_id' => $skill->id,
                    'type' => 'learn',
                ], [
                    'proficiency_level' => fake()->randomElement(['beginner', 'intermediate']),
                ]);
            }
        });

        UserSkill::query()->firstOrCreate([
            'user_id' => $admin->id,
            'skill_id' => $skills->first()->id,
            'type' => 'teach',
        ], ['proficiency_level' => 'advanced']);
    }
}
