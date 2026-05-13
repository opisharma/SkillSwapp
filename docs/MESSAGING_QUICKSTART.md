# SkillSwap Messaging System - Quick Start Guide

## 30-Second Setup

### Prerequisites
- PHP 8.2+
- Node.js 18+
- MySQL
- Git

### Installation (5 minutes)

```bash
# 1. Clone and install dependencies
cd SkillSwapp
composer install
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env - ensure BROADCAST_CONNECTION=reverb

# 3. Generate app key
php artisan key:generate

# 4. Setup database
php artisan migrate

# 5. Build assets
npm run build
```

## Running the System

### Terminal 1: Real-Time Server (Reverb)
```bash
php artisan reverb:start
```
✅ Should see: "Server running at ws://127.0.0.1:8080"

### Terminal 2: Laravel Server
```bash
php artisan serve
```
✅ Should see: "Server running at http://127.0.0.1:8000"

### Terminal 3: Frontend Dev Server
```bash
npm run dev
```
✅ Should see: "VITE v... ready in ... ms"

## Testing Real-Time Messaging

### Step 1: Open Two Browser Windows
1. Window A: http://localhost:5173/chat (or 8000/chat)
2. Window B: Same URL with different user account

### Step 2: Test Messaging
- **Window A**: Type message → Send
- **Window B**: See message appear instantly (no refresh needed!)
- Check: Message shows sender name, timestamp, ✓ (read) indicator

### Step 3: Test Typing Indicators
- **Window A**: Start typing in message input
- **Window B**: See "Typing..." animation
- **Window A**: Stop typing
- **Window B**: Animation disappears

### Step 4: Test Read Receipts
- **Window A**: See checkmark turn blue when Window B reads message
- **Window B**: Open any unread messages to auto-mark as read

## API Testing (Using cURL or Postman)

### Get Auth Token
```bash
curl -X POST http://localhost:8000/api/login \
  -d "email=user@example.com&password=password" \
  -H "Content-Type: application/x-www-form-urlencoded"
```

### Get Conversations
```bash
curl -X GET http://localhost:8000/api/matches \
  -H "Authorization: Bearer {token}"
```

### Send Message
```bash
curl -X POST http://localhost:8000/api/messages \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"match_id": 1, "body": "Hello!"}'
```

### Check Typing Event
```bash
curl -X POST http://localhost:8000/api/messages/1/typing \
  -H "Authorization: Bearer {token}"
```

## Debugging

### Check if Real-Time is Working

**Browser DevTools:**
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "WS" (WebSocket)
4. Should see connection to `ws://127.0.0.1:8080/app`
5. Click on it → Messages tab
6. Should see frames flowing in/out

**Laravel Logs:**
```bash
tail -f storage/logs/laravel.log
```

### Test Event Broadcasting

**Backend - In tinker:**
```bash
php artisan tinker

$user = User::first();
$match = SkillMatch::where('user_one_id', $user->id)->first();
$service = app('App\Services\MessagingService');

// This should trigger a MessageSent event that broadcasts
$msg = $service->send($match, $user, 'Test message from tinker');
// Check browser console - you should see the message appear!
```

### Check Channel Authorization

**In tinker:**
```php
$user = User::first();
$match = SkillMatch::where('user_one_id', $user->id)->first();

// This should return true
\Illuminate\Support\Facades\Broadcast::auth(
    \Illuminate\Http\Request::create('/', 'POST'),
    $user,
    'chat.' . $match->id
);
```

## Common Issues & Fixes

### Issue: WebSocket Connection Failed

**Problem:** Browser can't connect to `ws://127.0.0.1:8080`

**Solutions:**
1. **Reverb not running**: Check Terminal 1 - should say "Server running"
2. **Wrong port**: Check `.env` REVERB_PORT=8080
3. **Firewall**: Port 8080 blocked - check firewall settings
4. **VITE config**: Check `VITE_REVERB_PORT` in `.env` and vite.config.js

**Fix:**
```bash
# Terminal 1: Restart Reverb
php artisan reverb:start --debug
```

### Issue: Messages Not Appearing

**Problem:** Message sent successfully but doesn't appear in real-time

**Solutions:**
1. **Event not dispatching**: Check `app/Services/MessagingService.php`
2. **Channel subscription failed**: Check browser console for errors
3. **Event listener not registered**: Check `resources/js/Pages/Chat/Index.jsx`

**Debug:**
```bash
php artisan tinker
# Send a test message
$msg = Message::factory()->create();
event(new App\Events\MessageSent($msg));
# Check browser console for the event
```

### Issue: Typing Indicator Stuck

**Problem:** "User is typing..." stays forever

**Solutions:**
1. **Stop typing event not firing**: Check API `/messages/{id}/stop-typing`
2. **Timeout too long**: Check useTypingIndicator hook - default 300ms
3. **Network lag**: May need to increase timeout value

**Fix:**
```javascript
// In resources/js/Hooks/useMessaging.js
// Increase delay from 300ms to 500ms
const emitTyping = useCallback(() => {
    // ...
}, [matchId]); // Increase delayMs parameter
```

### Issue: Authorization Errors (403 Forbidden)

**Problem:** User can't access conversation

**Solutions:**
1. **Not part of match**: Verify `SkillMatch` has both user_one_id and user_two_id
2. **Policy check failing**: Check `SkillMatchPolicy::view()`
3. **Token expired**: Re-login and get new token

**Debug:**
```bash
php artisan tinker
$user = User::first();
$match = SkillMatch::first();
// Should return true if user is member
echo $user->can('view', $match) ? 'Allowed' : 'Denied';
```

### Issue: Messages Appear Delayed

**Problem:** Messages take several seconds to appear

**Solutions:**
1. **Echo not subscribed properly**: Check JavaScript console
2. **Broadcasting events queued**: Reduce load on queue worker
3. **Network latency**: Check browser network speed

**Fix:**
```bash
# Make broadcasting synchronous in dev
# In .env:
QUEUE_CONNECTION=sync
# This makes events broadcast immediately
```

## Performance Tips

1. **Use QUEUE_CONNECTION=sync** during development for instant broadcasting

2. **Limit messages per load** to 50 for better performance

3. **Enable browser devtools throttling** to simulate slow networks

4. **Monitor database queries**:
   ```bash
   php artisan query:log # Enable query logging
   tail -f storage/logs/query.log
   ```

5. **Check React re-renders**:
   - Install "React DevTools" browser extension
   - Components shouldn't re-render unnecessarily

## Production Checklist

Before deploying:
- [ ] Change BROADCAST_DRIVER to `pusher` (or keep Reverb with proper SSL)
- [ ] Set QUEUE_CONNECTION to `redis` (or `database` for small scale)
- [ ] Enable HTTPS/WSS (`VITE_REVERB_SCHEME=https`)
- [ ] Set proper PUSHER_APP credentials
- [ ] Run migrations on production server
- [ ] Build assets for production: `npm run build`
- [ ] Set up SSL certificates
- [ ] Configure Nginx/Apache to proxy WebSocket requests
- [ ] Set up monitoring and error tracking

## Next Steps

1. **Learn more**: Read `docs/MESSAGING_IMPLEMENTATION.md`
2. **Customize UI**: Edit React components in `resources/js/Components/`
3. **Add features**: Implement message search, reactions, etc.
4. **Deploy**: Follow production deployment guide
5. **Monitor**: Set up error tracking and performance monitoring

## Useful Commands

```bash
# Clear application cache
php artisan cache:clear

# Restart Reverb with debugging
php artisan reverb:start --debug

# Watch for file changes
npm run dev

# Build for production
npm run build

# Run migrations
php artisan migrate

# Create test data
php artisan tinker
# Then: User::factory(10)->create()

# Check database
php artisan db
mysql> select * from messages; -- View messages
mysql> select * from matches;  -- View conversations
```

## Getting Help

1. **Browser Console** (F12):
   - Check for JavaScript errors
   - Look for echo subscription events

2. **Laravel Logs** (terminal):
   ```bash
   tail -f storage/logs/laravel.log
   ```

3. **Network Tab** (F12):
   - Filter by "WS" to see WebSocket traffic
   - Check for 401/403 errors

4. **Discord/Slack**:
   - Share error messages from console
   - Include Laravel log excerpt
   - Show network tab screenshot

## Support Resources

- Docs: `/docs/MESSAGING_IMPLEMENTATION.md`
- API Reference: `/docs/API_ROUTES.md`
- Troubleshooting: `/docs/MESSAGING_VERIFICATION.md`
- Laravel Broadcasting: https://laravel.com/docs/broadcasting
- React: https://react.dev
- Tailwind: https://tailwindcss.com
