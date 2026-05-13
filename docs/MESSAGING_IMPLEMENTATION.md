# SkillSwap Real-Time Messaging System - Implementation Guide

## Overview

This guide covers the complete implementation of a production-ready, real-time messaging system for the SkillSwap application using Laravel 12, React, Inertia.js, and Laravel Reverb (or Pusher).

## Architecture

### Components

1. **Backend (Laravel 12)**
   - Broadcasting Events (MessageSent, MessageRead, UserTyping, UserStoppedTyping)
   - RESTful API endpoints for messaging
   - Real-time channel authorization
   - Message service layer with business logic

2. **Frontend (React + Inertia.js)**
   - Conversation sidebar with real-time updates
   - Chat window with auto-scroll
   - Typing indicators
   - Read/unread status
   - Message bubbles with timestamps

3. **Real-Time (Laravel Reverb / Pusher)**
   - Private channels for secure conversations
   - Event broadcasting
   - Presence channels for online status

## Prerequisites

```bash
# Required packages (already in composer.json)
- laravel/framework: 12.x
- inertiajs/inertia-laravel: ^1.0
- laravel/reverb: ^0.1 (or pusher/pusher-php-server for Pusher)

# Required npm packages (already in package.json)
- react: ^18.x
- @inertiajs/react: ^1.x
- laravel-echo: ^1.15
- pusher-js: ^8.x
```

## Setup Instructions

### Step 1: Environment Configuration

Update your `.env` file:

```env
# Broadcasting (using Reverb - Laravel's real-time server)
BROADCAST_CONNECTION=reverb
BROADCAST_DRIVER=reverb

# Reverb Configuration
REVERB_APP_ID=123456
REVERB_APP_KEY=skillswap-local-key
REVERB_APP_SECRET=skillswap-local-secret
REVERB_HOST=127.0.0.1
REVERB_PORT=8080
REVERB_SCHEME=http

# Frontend environment variables
VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"

# For production Pusher integration (optional):
# BROADCAST_DRIVER=pusher
# PUSHER_APP_ID=your_app_id
# PUSHER_APP_KEY=your_app_key
# PUSHER_APP_SECRET=your_app_secret
# PUSHER_APP_CLUSTER=mt1
```

### Step 2: Database Setup

Run the migration to add indexes:

```bash
php artisan migrate
```

This will create the messages table with the following structure:
- `id` (primary key)
- `match_id` (foreign key to matches table)
- `sender_id` (foreign key to users table)
- `receiver_id` (foreign key to users table)
- `body` (text message)
- `read_at` (nullable timestamp for read status)
- `created_at`, `updated_at`

### Step 3: Broadcasting Channels Configuration

The channels are defined in `routes/channels.php`:

```php
// Private chat channel - only conversation members can listen
Broadcast::channel('chat.{conversationId}', function ($user, int $conversationId) {
    return \App\Models\SkillMatch::query()
        ->where('id', $conversationId)
        ->where(function ($query) use ($user) {
            $query->where('user_one_id', $user->id)
                ->orWhere('user_two_id', $user->id);
        })
        ->exists();
});

// Online presence channel
Broadcast::channel('online.{userId}', function ($user, int $userId) {
    return (int) $user->id === $userId;
});
```

### Step 4: Start Real-Time Server

#### Using Laravel Reverb (Recommended for Development):

```bash
# Terminal 1: Run Laravel Reverb
php artisan reverb:start

# Terminal 2: Run Laravel development server
php artisan serve

# Terminal 3: Build frontend assets
npm run dev
```

#### Using Pusher (Production):

1. Create a Pusher account at https://pusher.com
2. Create an application and get your credentials
3. Update `.env` with Pusher credentials
4. The system will automatically use Pusher based on `BROADCAST_DRIVER=pusher`

### Step 5: Frontend Setup

Ensure `resources/js/bootstrap.js` is properly configured:

```javascript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Echo = new Echo({
  broadcaster: 'reverb', // or 'pusher' for Pusher
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: Number(import.meta.env.VITE_REVERB_PORT),
  wssPort: Number(import.meta.env.VITE_REVERB_PORT),
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME) === 'https',
  enabledTransports: ['ws', 'wss'],
  authEndpoint: '/broadcasting/auth',
  auth: {
    headers: {
      'X-CSRF-TOKEN': csrfToken,
    },
  },
});
```

## API Endpoints

### Get All Conversations
```
GET /api/matches
Authorization: Bearer {token}
```

### Get Messages for Conversation
```
GET /api/messages/{matchId}
Authorization: Bearer {token}
```

Response:
```json
{
  "data": [
    {
      "id": 1,
      "match_id": 5,
      "sender_id": 1,
      "receiver_id": 2,
      "body": "Hello!",
      "is_read": true,
      "created_at": "2026-05-13T10:30:00Z",
      "sender": {
        "id": 1,
        "name": "John Doe",
        "profile_photo": "..."
      }
    }
  ]
}
```

### Send Message
```
POST /api/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "match_id": 5,
  "body": "Hello, how are you?"
}
```

### Emit Typing Indicator
```
POST /api/messages/{matchId}/typing
Authorization: Bearer {token}
```

### Stop Typing Indicator
```
POST /api/messages/{matchId}/stop-typing
Authorization: Bearer {token}
```

## Real-Time Events

### MessageSent Event

Broadcast to all members of a conversation when a new message is sent:

```json
{
  "id": 1,
  "match_id": 5,
  "sender_id": 1,
  "receiver_id": 2,
  "body": "Hello!",
  "is_read": false,
  "created_at": "2026-05-13T10:30:00Z",
  "sender": {
    "id": 1,
    "name": "John Doe",
    "profile_photo": "..."
  }
}
```

### MessageRead Event

Broadcast when a message is read:

```json
{
  "message_id": 1,
  "read_at": "2026-05-13T10:30:05Z"
}
```

### UserTyping Event

Broadcast when a user starts typing:

```json
{
  "user_id": 1,
  "user_name": "John Doe"
}
```

### UserStoppedTyping Event

Broadcast when a user stops typing:

```json
{
  "user_id": 1
}
```

## React Component Structure

### Pages
- `Chat/Index.jsx` - Main messaging page (handles state and real-time subscriptions)

### Components
- `ConversationSidebar.jsx` - List of conversations
- `ChatWindow.jsx` - Main chat interface
- `MessageBubble.jsx` - Individual message display
- `ChatInput.jsx` - Message input form
- `TypingIndicator.jsx` - Typing animation

### Hooks
- `useMessaging.js` - Custom hooks for:
  - `useAutoScroll()` - Auto-scroll to latest message
  - `useTypingIndicator()` - Typing indicator with debounce
  - `formatMessageTime()` - Format timestamps
  - `groupMessagesByDate()` - Group messages by date

## Real-Time Flow

### Sending a Message

1. User types and submits message via ChatInput
2. Message sent to `/api/messages` endpoint
3. Backend creates message and broadcasts `MessageSent` event
4. Event broadcast to private `chat.{matchId}` channel
5. All connected users receive event via Laravel Echo
6. React state updates automatically
7. ChatWindow re-renders with new message

### Reading Messages

1. User opens conversation
2. Frontend fetches messages via `/api/messages/{matchId}`
3. Backend marks all unread messages as read
4. For each message, `MessageRead` event is broadcast
5. Other user receives event and updates message status
6. Read indicator (checkmark) becomes blue

### Typing Indicators

1. User types in ChatInput
2. Typing event emitted to `/api/messages/{matchId}/typing` (debounced)
3. Backend broadcasts `UserTyping` event
4. Other user receives typing event
5. TypingIndicator component displays "User is typing..."
6. After 3 seconds of inactivity, typing stops automatically
7. `UserStoppedTyping` event broadcast
8. TypingIndicator hides

## Performance Optimization

### Database
- Indexed queries on `match_id`, `created_at`, `receiver_id`, `read_at`
- Eager loading of relationships to prevent N+1 queries
- Message pagination (50 messages per request)

### Frontend
- React.memo for message bubbles
- useCallback for stable function references
- useEffect cleanup to prevent memory leaks
- Debounced typing indicators (300ms)
- Lazy loading of messages as user scrolls

### Broadcasting
- Private channels ensure only members receive messages
- Selective broadcasting prevents unauthorized listeners
- Event pruning after timeout

## Security Considerations

### Authorization
1. Private channels validate user is conversation member
2. API endpoints check `SkillMatchPolicy::view()`
3. Users can only fetch their own conversations
4. Users can only send messages in their conversations

### Data Protection
1. All messages encrypted in transit (HTTPS/WSS)
2. CSRF protection on all POST requests
3. Authentication required (Sanctum tokens)
4. Input validation on message body

### Channel Security
1. Private channels use `Broadcast::channel()` guards
2. Only matching users can subscribe to `chat.{conversationId}`
3. No broadcast of sensitive user data
4. Server-side validation of all events

## Troubleshooting

### Messages Not Sending
1. Check `/api/messages` POST endpoint is working
2. Verify CSRF token is included
3. Check Laravel logs: `tail -f storage/logs/laravel.log`
4. Verify match_id exists and user is authorized

### Real-Time Updates Not Working
1. Check Reverb/Pusher is running: `php artisan reverb:start`
2. Check WebSocket connection in browser DevTools (Network tab)
3. Check Echo is initialized in `bootstrap.js`
4. Check channel name matches: `chat.{matchId}`
5. Verify authentication endpoint `/broadcasting/auth` returns 200

### Typing Indicator Not Showing
1. Check POST `/api/messages/{matchId}/typing` succeeds
2. Verify WebSocket connection is active
3. Check event is being broadcast in server logs
4. Verify typing timeout not firing too early

### Read Receipts Not Working
1. Verify messages marked as read in database
2. Check `MessageRead` event is being broadcast
3. Verify listener is registered: `channel.on('message.read', ...)`
4. Check message ID in event matches frontend message

## Deployment

### Production Considerations

1. **Use Pusher or Laravel Reverb in Production**
   - Set `BROADCAST_DRIVER=pusher` for Pusher
   - Configure Reverb with proper SSL certificates
   - Use WebSocket Secure (WSS) protocol

2. **Database Optimization**
   - Run migrations in staging first
   - Monitor query performance with indexes
   - Consider archiving old messages

3. **Broadcasting Server**
   - Use process manager (Supervisor) to keep Reverb running
   - Monitor memory usage
   - Set up error logging

4. **Security**
   - Use HTTPS/WSS only
   - Implement rate limiting on message endpoints
   - Add spam detection
   - Monitor for abuse patterns

### Supervisor Configuration (for Reverb)

```ini
[program:skillswap-reverb]
process_name=%(program_name)s
command=php /path/to/skillswap/artisan reverb:start
autostart=true
autorestart=true
numprocs=1
redirect_stderr=true
stdout_logfile=/var/log/skillswap-reverb.log
```

### Nginx Configuration (Reverb Proxy)

```nginx
upstream reverb {
    server 127.0.0.1:8080;
}

server {
    listen 443 ssl http2;
    server_name skillswap.com;

    location /app {
        proxy_pass http://reverb;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Testing

### Test Real-Time Messaging

```bash
# Terminal 1: Start Reverb
php artisan reverb:start

# Terminal 2: Start Laravel server
php artisan serve

# Terminal 3: Start frontend dev server
npm run dev

# Open two browser windows and navigate to /chat
# Send message in one window, verify it appears in the other in real-time
```

### Test Typing Indicators

1. Open two browser windows with different users
2. Start typing in message input
3. Should see "User is typing..." appear in other window
4. Stop typing after 3 seconds
5. Should see typing indicator disappear

### Test Read Receipts

1. Send message from user A to user B
2. Open conversation in user B's window
3. Message should show as read (blue checkmark)
4. Read event should broadcast to user A

## Advanced Features (Future)

1. **Message Search**
   - Full-text search across conversations
   - Filter by date range, sender

2. **Media Sharing**
   - Image upload and preview
   - File attachments
   - Link previews

3. **Message Reactions**
   - Emoji reactions to messages
   - Real-time update of reaction counts

4. **Voice/Video Calling**
   - Integrate Twilio or WebRTC
   - In-app calling from chat

5. **Message Encryption**
   - End-to-end encryption
   - Key exchange protocol

6. **Analytics**
   - Message statistics
   - User engagement metrics
   - Response time analytics

## Support & Resources

- Laravel Broadcasting: https://laravel.com/docs/broadcasting
- Laravel Reverb: https://laravel.com/docs/reverb
- Pusher Documentation: https://pusher.com/docs
- Laravel Echo: https://laravel.com/docs/echo
- React Documentation: https://react.dev

## Checklist for Production

- [ ] Environment variables configured correctly
- [ ] Database migrations run
- [ ] Real-time server started (Reverb or Pusher)
- [ ] SSL certificates installed
- [ ] CORS headers configured
- [ ] Rate limiting enabled
- [ ] Error logging configured
- [ ] Backups automated
- [ ] Performance tested under load
- [ ] Security audit completed
- [ ] User documentation created
