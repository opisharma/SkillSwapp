<?php

namespace App\Providers;

use App\Models\Session;
use App\Models\SkillMatch;
use App\Models\User;
use App\Policies\SessionPolicy;
use App\Policies\SkillMatchPolicy;
use App\Policies\AdminPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        SkillMatch::class => SkillMatchPolicy::class,
        Session::class => SessionPolicy::class,
        User::class => AdminPolicy::class,
    ];

    public function boot(): void
    {
        Gate::define('admin', fn (User $user) => $user->is_admin === true);
    }
}
