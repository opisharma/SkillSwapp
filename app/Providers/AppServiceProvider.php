<?php

namespace App\Providers;

use App\Repositories\Contracts\MatchRepositoryInterface;
use App\Repositories\Contracts\SkillRepositoryInterface;
use App\Repositories\Eloquent\MatchRepository;
use App\Repositories\Eloquent\SkillRepository;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(MatchRepositoryInterface::class, MatchRepository::class);
        $this->app->bind(SkillRepositoryInterface::class, SkillRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
