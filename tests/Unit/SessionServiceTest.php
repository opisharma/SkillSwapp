<?php

namespace Tests\Unit;

use App\Models\Skill;
use App\Models\User;
use App\Services\SessionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SessionServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_session_creation_works(): void
    {
        $host = User::factory()->create();
        $participant = User::factory()->create();
        $skill = Skill::query()->create(['name' => 'Laravel', 'category' => 'Web']);

        $session = app(SessionService::class)->create($host, [
            'participant_user_id' => $participant->id,
            'skill_id' => $skill->id,
            'meeting_link' => 'https://meet.example.com/room/abc',
            'session_time' => now()->addDay(),
        ]);

        $this->assertSame('pending', $session->status);
    }
}
