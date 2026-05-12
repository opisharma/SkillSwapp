<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'remember_token' => Str::random(10),
            'university' => fake()->randomElement(['IUT', 'DU', 'NSU', 'BRAC University']),
            'department' => fake()->randomElement(['CSE', 'EEE', 'BBA']),
            'bio' => fake()->sentence(12),
            'availability' => fake()->randomElement(['Weekends', 'Evenings', 'Morning']),
        ];
    }
}
