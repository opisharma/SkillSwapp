# API Routes

## Auth (Laravel Breeze)
- POST /register
- POST /login
- POST /forgot-password
- POST /reset-password
- POST /logout
- GET /verify-email

## User & Profile
- GET /profile
- PUT /profile

## Skills
- GET /skills
- POST /skills
- POST /user-skills
- DELETE /user-skills/{id}

## Matching
- GET /matches
- POST /matches/refresh
- GET /api/matches

## Messaging
- GET /chat/{match}
- POST /messages
- GET /api/messages/{match}

## Sessions
- GET /sessions
- POST /sessions
- PATCH /sessions/{session}/status

## Reviews
- GET /reviews/{user}
- POST /reviews
- GET /api/reviews/{user}

## Admin
- GET /admin/dashboard
- PATCH /admin/users/{user}/ban
- PATCH /admin/users/{user}/unban
- DELETE /admin/skills/{skill}
