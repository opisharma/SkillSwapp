# SkillSwap Messaging API Reference

## Base URL

```
https://skillswap.local:8000/api
```

## Authentication

All endpoints require authentication using Laravel Sanctum bearer tokens.

```
Authorization: Bearer {token}
```

## Response Format

All responses are JSON with the following structure:

### Success Response
```json
{
  "data": { /* resource data */ }
}
```

### Error Response
```json
{
  "message": "Error description",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

## Endpoints

---

## GET /matches

Retrieve all skill matches (conversations) for the authenticated user.

### Request

```http
GET /api/matches HTTP/1.1
Authorization: Bearer {token}
Accept: application/json
```

### Response (200 OK)

```json
[
  {
    "id": 1,
    "user_one_id": 1,
    "user_two_id": 2,
    "match_percentage": 85,
    "mutual_skills": ["JavaScript", "React", "Web Development"],
    "created_at": "2026-05-10T10:30:00Z",
    "userOne": {
      "id": 1,
      "name": "John Doe",
      "profile_photo": "https://example.com/photos/john.jpg"
    },
    "userTwo": {
      "id": 2,
      "name": "Jane Smith",
      "profile_photo": "https://example.com/photos/jane.jpg"
    },
    "peer": {
      "id": 2,
      "name": "Jane Smith",
      "university": "MIT",
      "department": "Computer Science",
      "profile_photo": "https://example.com/photos/jane.jpg"
    },
    "latestMessage": {
      "id": 123,
      "body": "Hey, how are you?",
      "sender_id": 1,
      "created_at": "2026-05-13T14:20:00Z"
    }
  }
]
```

### Status Codes
- `200` OK
- `401` Unauthorized - Invalid/missing token
- `500` Server Error

### Example cURL

```bash
curl -X GET https://skillswap.local:8000/api/matches \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Accept: application/json"
```

---

## GET /messages/{matchId}

Retrieve messages for a specific conversation (match).

### Request

```http
GET /api/messages/1 HTTP/1.1
Authorization: Bearer {token}
Accept: application/json
```

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| matchId | integer | ID of the match/conversation (required) |

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Pagination page (optional) |
| per_page | integer | 50 | Messages per page (optional, max 100) |

### Response (200 OK)

```json
{
  "data": [
    {
      "id": 1,
      "match_id": 1,
      "sender_id": 1,
      "receiver_id": 2,
      "body": "Hello! How are you doing today?",
      "is_read": true,
      "created_at": "2026-05-13T10:30:00Z",
      "sender": {
        "id": 1,
        "name": "John Doe",
        "profile_photo": "https://example.com/photos/john.jpg"
      }
    },
    {
      "id": 2,
      "match_id": 1,
      "sender_id": 2,
      "receiver_id": 1,
      "body": "I'm doing great! Just finished a project.",
      "is_read": true,
      "created_at": "2026-05-13T10:31:00Z",
      "sender": {
        "id": 2,
        "name": "Jane Smith",
        "profile_photo": "https://example.com/photos/jane.jpg"
      }
    }
  ]
}
```

### Status Codes
- `200` OK
- `401` Unauthorized
- `403` Forbidden - User not part of this conversation
- `404` Not Found - Match doesn't exist

### Example cURL

```bash
curl -X GET "https://skillswap.local:8000/api/messages/1" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

### Automatic Read Status

When you fetch messages via this endpoint:
1. All unread messages for the authenticated user are marked as read
2. MessageRead events are broadcast to the other user
3. Read receipts appear in real-time

---

## POST /messages

Send a new message in a conversation.

### Request

```http
POST /api/messages HTTP/1.1
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json

{
  "match_id": 1,
  "body": "This is my message"
}
```

### Request Body

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| match_id | integer | ✓ | Must exist in matches table, user must be part of it |
| body | string | ✓ | Min 1 char, Max 5000 chars |

### Response (201 Created)

```json
{
  "data": {
    "id": 123,
    "match_id": 1,
    "sender_id": 1,
    "receiver_id": 2,
    "body": "This is my message",
    "is_read": false,
    "created_at": "2026-05-13T14:25:00Z",
    "sender": {
      "id": 1,
      "name": "John Doe",
      "profile_photo": "https://example.com/photos/john.jpg"
    }
  }
}
```

### Status Codes
- `201` Created - Message sent successfully
- `400` Bad Request - Validation error
- `401` Unauthorized
- `403` Forbidden - Not part of this conversation
- `404` Not Found - Match doesn't exist

### Validation Errors (400)

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "match_id": [
      "The match id field is required."
    ],
    "body": [
      "The body field is required.",
      "The body field must not exceed 5000 characters."
    ]
  }
}
```

### Broadcasting

When a message is sent:
1. Message is saved to database
2. `MessageSent` event is broadcast to `private-chat.{matchId}` channel
3. All connected users receive the event in real-time
4. Notification is sent to the receiver (if configured)

### Example cURL

```bash
curl -X POST https://skillswap.local:8000/api/messages \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "match_id": 1,
    "body": "Hello! This is my message."
  }'
```

### Example JavaScript (Fetch)

```javascript
async function sendMessage(matchId, body) {
  const response = await fetch('/api/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-CSRF-TOKEN': document.querySelector('[name=csrf-token]').value
    },
    body: JSON.stringify({
      match_id: matchId,
      body: body
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return await response.json();
}
```

---

## POST /messages/{matchId}/typing

Emit a typing indicator event to notify other users you're typing.

### Request

```http
POST /api/messages/1/typing HTTP/1.1
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| matchId | integer | ID of the match (required) |

### Response (200 OK)

```json
{
  "success": true
}
```

### Broadcasting

When typing is emitted:
1. `UserTyping` event is broadcast to `private-chat.{matchId}` channel
2. Payload includes user_id and user_name
3. Other users see "User is typing..." indicator
4. Typing indicator auto-hides after 3 seconds of inactivity

### Status Codes
- `200` OK
- `401` Unauthorized
- `403` Forbidden - Not part of this conversation
- `404` Not Found - Match doesn't exist

### Recommended Usage

```javascript
import { useTypingIndicator } from './hooks/useMessaging';

function ChatInput({ matchId }) {
  const emitTyping = useTypingIndicator(matchId);

  const handleChange = (e) => {
    setValue(e.target.value);
    emitTyping(); // Call with debounce (300ms)
  };

  return <input onChange={handleChange} />;
}
```

### Example cURL

```bash
curl -X POST https://skillswap.local:8000/api/messages/1/typing \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

---

## POST /messages/{matchId}/stop-typing

Stop the typing indicator.

### Request

```http
POST /api/messages/1/stop-typing HTTP/1.1
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| matchId | integer | ID of the match (required) |

### Response (200 OK)

```json
{
  "success": true
}
```

### Broadcasting

When stop-typing is emitted:
1. `UserStoppedTyping` event is broadcast
2. Other users' typing indicator hides immediately
3. Called automatically after 3 seconds of inactivity

### Status Codes
- `200` OK
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found

### Example cURL

```bash
curl -X POST https://skillswap.local:8000/api/messages/1/stop-typing \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

---

## Real-Time Events

### Event: message.sent

Broadcast when a new message is sent.

**Channel:** `private-chat.{matchId}`

**Payload:**
```json
{
  "id": 123,
  "match_id": 1,
  "sender_id": 1,
  "receiver_id": 2,
  "body": "Hello!",
  "is_read": false,
  "created_at": "2026-05-13T14:25:00Z",
  "sender": {
    "id": 1,
    "name": "John Doe",
    "profile_photo": "https://example.com/photos/john.jpg"
  }
}
```

**Listener (JavaScript):**
```javascript
window.Echo.private(`chat.${matchId}`)
  .on('message.sent', (data) => {
    // Add message to UI
    setMessages(prev => [...prev, data]);
  });
```

---

### Event: message.read

Broadcast when messages are read.

**Channel:** `private-chat.{matchId}`

**Payload:**
```json
{
  "message_id": 123,
  "read_at": "2026-05-13T14:26:00Z"
}
```

**Listener (JavaScript):**
```javascript
window.Echo.private(`chat.${matchId}`)
  .on('message.read', (data) => {
    // Update message read status
    setMessages(prev => prev.map(msg =>
      msg.id === data.message_id
        ? { ...msg, is_read: true }
        : msg
    ));
  });
```

---

### Event: user.typing

Broadcast when a user starts typing.

**Channel:** `private-chat.{matchId}`

**Payload:**
```json
{
  "user_id": 2,
  "user_name": "Jane Smith"
}
```

**Listener (JavaScript):**
```javascript
window.Echo.private(`chat.${matchId}`)
  .on('user.typing', (data) => {
    setTypingUsers(prev => {
      if (!prev.includes(data.user_name)) {
        return [...prev, data.user_name];
      }
      return prev;
    });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setTypingUsers(prev => 
        prev.filter(name => name !== data.user_name)
      );
    }, 3000);
  });
```

---

### Event: user.stopped-typing

Broadcast when a user stops typing.

**Channel:** `private-chat.{matchId}`

**Payload:**
```json
{
  "user_id": 2
}
```

**Listener (JavaScript):**
```javascript
window.Echo.private(`chat.${matchId}`)
  .on('user.stopped-typing', (data) => {
    setTypingUsers(prev =>
      prev.filter(name => name !== otherUserName)
    );
  });
```

---

## Rate Limiting

API endpoints are rate limited to prevent abuse:

| Endpoint | Limit |
|----------|-------|
| POST /api/messages | 30 requests/minute |
| POST /api/messages/{id}/typing | 60 requests/minute |
| GET /api/messages/{id} | 60 requests/minute |

Responses include rate limit headers:

```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 25
X-RateLimit-Reset: 1620000000
```

When limit exceeded (429):

```json
{
  "message": "Too many requests. Please try again later.",
  "retry_after": 60
}
```

---

## Error Handling

### Common Error Responses

**401 Unauthorized:**
```json
{
  "message": "Unauthenticated."
}
```

**403 Forbidden:**
```json
{
  "message": "This action is unauthorized."
}
```

**404 Not Found:**
```json
{
  "message": "Not found"
}
```

**422 Unprocessable Entity:**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

**429 Too Many Requests:**
```json
{
  "message": "Too many requests. Please try again later.",
  "retry_after": 60
}
```

---

## Code Examples

### Complete Chat Flow (JavaScript)

```javascript
// 1. Fetch conversations
const matchesResponse = await fetch('/api/matches', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const matches = await matchesResponse.json();

// 2. Select a match and fetch messages
const selectedMatch = matches[0];
const messagesResponse = await fetch(`/api/messages/${selectedMatch.id}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
const initialMessages = await messagesResponse.json();

// 3. Subscribe to real-time events
window.Echo.private(`chat.${selectedMatch.id}`)
  .on('message.sent', (message) => {
    // Update UI with new message
  })
  .on('message.read', (data) => {
    // Update read status
  })
  .on('user.typing', (data) => {
    // Show typing indicator
  });

// 4. Send message
const response = await fetch('/api/messages', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    match_id: selectedMatch.id,
    body: 'Hello!'
  })
});

// 5. Emit typing (with debounce)
const emitTyping = debounce(() => {
  fetch(`/api/messages/${selectedMatch.id}/typing`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}, 300);

inputElement.addEventListener('input', emitTyping);
```

### Error Handling

```javascript
async function sendMessage(matchId, body) {
  try {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ match_id: matchId, body })
    });

    if (!response.ok) {
      const error = await response.json();
      
      if (response.status === 429) {
        // Rate limited
        console.error('Too many requests:', error.retry_after);
      } else if (response.status === 403) {
        // Unauthorized
        console.error('Not authorized to message this user');
      } else if (response.status === 422) {
        // Validation error
        console.error('Validation errors:', error.errors);
      }
      
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
}
```

---

## Testing API Endpoints

### Using Postman

1. **Create collection:** "SkillSwap Messaging"

2. **Set up variables:**
   - `base_url`: `https://skillswap.local:8000/api`
   - `token`: Your Sanctum bearer token
   - `match_id`: 1

3. **Create requests:**

   **GET Matches:**
   ```
   GET {{base_url}}/matches
   Headers: Authorization: Bearer {{token}}
   ```

   **POST Message:**
   ```
   POST {{base_url}}/messages
   Headers: 
     - Authorization: Bearer {{token}}
     - Content-Type: application/json
   Body: {
     "match_id": {{match_id}},
     "body": "Test message"
   }
   ```

4. **Run collection** with different test cases

### Using Insomnia

Similar to Postman - import the endpoints and set environment variables.

---

## Pagination

Endpoints that return lists support pagination via query parameters:

```
GET /api/messages/1?page=2&per_page=25
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "meta": {
    "current_page": 2,
    "from": 26,
    "last_page": 10,
    "per_page": 25,
    "to": 50,
    "total": 250
  },
  "links": {
    "first": "...",
    "last": "...",
    "prev": "...",
    "next": "..."
  }
}
```

---

## CORS & Security

- All API endpoints require HTTPS in production
- CORS headers allow same-origin requests
- CSRF tokens required for state-changing operations
- Private channels validate user membership
- WebSocket connections use WSS (WebSocket Secure)

---

## Support

For API issues, check:
1. **Response status code** and error message
2. **Browser console** for JavaScript errors
3. **Laravel logs**: `storage/logs/laravel.log`
4. **Network tab**: Verify requests are being sent correctly
