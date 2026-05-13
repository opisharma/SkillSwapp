<?php

use App\Http\Controllers\MatchController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/matches', [MatchController::class, 'apiIndex']);

    // Message routes
    Route::get('/messages/{match}', [MessageController::class, 'apiConversation']);
    Route::post('/messages', [MessageController::class, 'apiStore']);
    Route::post('/messages/{match}/typing', [MessageController::class, 'emitTyping']);
    Route::post('/messages/{match}/stop-typing', [MessageController::class, 'emitStoppedTyping']);

    Route::get('/reviews/{user}', [ReviewController::class, 'apiIndex']);
});
