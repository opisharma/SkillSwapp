# SkillSwap Architecture

## Pattern Summary
- MVC at framework level
- Repository + Service for business logic and persistence abstraction
- Form Request validation for every write endpoint
- Policies for ownership/membership authorization
- API Resources for consistent serialization

## Domain Modules
1. Auth and user profile
2. Skills and user skill mapping
3. Mutual match engine
4. Messaging and read status
5. Session scheduling lifecycle
6. Reviews and aggregated ratings
7. Admin moderation and analytics

## Security Controls
- CSRF via Laravel middleware
- XSS guarded by escaped output in Blade/Inertia pages
- Password hashing via Laravel Hash facade
- Route middleware for auth and email verification
- Policy and role checks for sensitive actions

## Future Scaling
- Move messaging to websockets (Reverb/Pusher)
- Queue notifications and match recomputation
- Add Redis caching for search and dashboard metrics
- Add OpenAI/Gemini-backed recommendation strategy interface
