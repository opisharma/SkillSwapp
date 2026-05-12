<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\SkillController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Landing');
})->name('landing');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/skills', [SkillController::class, 'index'])->name('skills.index');
    Route::post('/skills', [SkillController::class, 'store'])->name('skills.store');
    Route::post('/user-skills', [SkillController::class, 'storeUserSkill'])->name('user-skills.store');
    Route::delete('/user-skills/{userSkill}', [SkillController::class, 'destroyUserSkill'])->name('user-skills.destroy');

    Route::get('/matches', [MatchController::class, 'index'])->name('matches.index');
    Route::post('/matches/refresh', [MatchController::class, 'refresh'])->name('matches.refresh');

    Route::get('/chat/{match}', [MessageController::class, 'index'])->name('chat.index');
    Route::post('/messages', [MessageController::class, 'store'])->name('messages.store');

    Route::get('/sessions', [SessionController::class, 'index'])->name('sessions.index');
    Route::post('/sessions', [SessionController::class, 'store'])->name('sessions.store');
    Route::patch('/sessions/{session}/status', [SessionController::class, 'updateStatus'])->name('sessions.status.update');

    Route::get('/reviews/{user}', [ReviewController::class, 'index'])->name('reviews.index');
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');

    Route::prefix('/admin')->middleware('can:admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
        Route::patch('/users/{user}/ban', [AdminController::class, 'banUser'])->name('admin.users.ban');
        Route::patch('/users/{user}/unban', [AdminController::class, 'unbanUser'])->name('admin.users.unban');
        Route::delete('/skills/{skill}', [AdminController::class, 'deleteSkill'])->name('admin.skills.destroy');
    });
});
