<?php

use App\Http\Controllers\MatchController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/matches', [MatchController::class, 'apiIndex']);
    Route::get('/messages/{match}', [MessageController::class, 'apiConversation']);
    Route::get('/reviews/{user}', [ReviewController::class, 'apiIndex']);
});
