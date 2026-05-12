<?php

namespace App\Providers;

use App\Models\Session;
use App\Models\SkillMatch;
use App\Policies\SessionPolicy;
use App\Policies\SkillMatchPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        SkillMatch::class => SkillMatchPolicy::class,
        Session::class => SessionPolicy::class,
    ];

    public function boot(): void
    {
    }
}
