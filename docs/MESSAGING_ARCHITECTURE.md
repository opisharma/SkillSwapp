# SkillSwap Messaging System - Architecture & Diagrams

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (React)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │  Chat/Index.jsx  │  │ ChatWindow.jsx   │  │ ConversationList │   │
│  │  (Main Page)     │  │ (Display)        │  │ (Sidebar)        │   │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘   │
│           │                     │                     │               │
│           └─────────────────────┴─────────────────────┘               │
│                         │                                             │
│                    useEffect & Hooks                                  │
│                         │                                             │
│  ┌──────────────────────┴──────────────────────┐                    │
│  │                                              │                    │
│  ▼                                              ▼                    │
│ ┌─────────────────────────────────────────────────────────────┐    │
│ │             Laravel Echo (WebSocket Client)                 │    │
│ │  - Subscribes to: private-chat.{matchId}                    │    │
│ │  - Listens to: message.sent, message.read,                  │    │
│ │                user.typing, user.stopped-typing             │    │
│ └─────────────────────────────────────────────────────────────┘    │
│           │                                                         │
│           │ WebSocket (ws://localhost:8080)                         │
│           │                                                         │
└───────────┼─────────────────────────────────────────────────────────┘
            │
            │
            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  REAL-TIME SERVER (Laravel Reverb)                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Handles WebSocket connections                                       │
│  - Manages message subscriptions                                     │
│  - Routes broadcast events to clients                                │
│  - Validates channel authorization                                   │
│                                                                       │
│  Private Channels:                                                   │
│  - private-chat.{conversationId}  (for messages)                     │
│  - private-online.{userId}        (for presence)                     │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
            │
            │ HTTP (REST API calls)
            │
            ▼
┌─────────────────────────────────────────────────────────────────────┐
│              BACKEND LAYER (Laravel 12)                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  API ROUTES:                                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ GET  /api/matches                 → MatchController@apiIndex │  │
│  │ GET  /api/messages/{match}        → MessageController@api... │  │
│  │ POST /api/messages                → MessageController@apiS.. │  │
│  │ POST /api/messages/{id}/typing    → MessageController@emitT. │  │
│  │ POST /api/messages/{id}/stop-typing                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                     │                                                │
│                     ▼                                                │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │              CONTROLLERS                                    │    │
│  │ ┌──────────────────────────────────────────────────────┐   │    │
│  │ │ MessageController                                    │   │    │
│  │ │ - index() - Show conversation (Inertia)             │   │    │
│  │ │ - store() - Save message via form                   │   │    │
│  │ │ - apiConversation() - Get messages (JSON)           │   │    │
│  │ │ - apiStore() - Create message (JSON)                │   │    │
│  │ │ - emitTyping() - Broadcast typing                   │   │    │
│  │ │ - emitStoppedTyping() - Broadcast stop typing       │   │    │
│  │ └──────────────────────────────────────────────────────┘   │    │
│  └────────────────────────────────────────────────────────────┘    │
│                     │                                                │
│                     ▼                                                │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │              SERVICES                                       │    │
│  │ ┌──────────────────────────────────────────────────────┐   │    │
│  │ │ MessagingService                                     │   │    │
│  │ │ - send() → broadcasts MessageSent event             │   │    │
│  │ │ - markAsRead() → broadcasts MessageRead event       │   │    │
│  │ └──────────────────────────────────────────────────────┘   │    │
│  └────────────────────────────────────────────────────────────┘    │
│                     │                                                │
│                     ▼                                                │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │              EVENTS (Broadcasting)                          │    │
│  │ ┌──────────────────────────────────────────────────────┐   │    │
│  │ │ MessageSent                                          │   │    │
│  │ │ - Implements: ShouldBroadcast                        │   │    │
│  │ │ - Broadcasts to: private-chat.{conversationId}      │   │    │
│  │ │ - Event name: message.sent                          │   │    │
│  │ │ - Payload: message data with sender info            │   │    │
│  │ ├──────────────────────────────────────────────────────┤   │    │
│  │ │ MessageRead                                          │   │    │
│  │ │ - Broadcasts to: private-chat.{conversationId}      │   │    │
│  │ │ - Event name: message.read                          │   │    │
│  │ │ - Payload: message_id, read_at                      │   │    │
│  │ ├──────────────────────────────────────────────────────┤   │    │
│  │ │ UserTyping                                           │   │    │
│  │ │ - Broadcasts to: private-chat.{conversationId}      │   │    │
│  │ │ - Event name: user.typing                           │   │    │
│  │ │ - Payload: user_id, user_name                       │   │    │
│  │ ├──────────────────────────────────────────────────────┤   │    │
│  │ │ UserStoppedTyping                                    │   │    │
│  │ │ - Broadcasts to: private-chat.{conversationId}      │   │    │
│  │ │ - Event name: user.stopped-typing                   │   │    │
│  │ │ - Payload: user_id                                  │   │    │
│  │ └──────────────────────────────────────────────────────┘   │    │
│  └────────────────────────────────────────────────────────────┘    │
│                     │                                                │
│                     ▼                                                │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │              AUTHORIZATION                                 │    │
│  │ ┌──────────────────────────────────────────────────────┐   │    │
│  │ │ SkillMatchPolicy::view()                             │   │    │
│  │ │ - Checks user is user_one_id or user_two_id        │   │    │
│  │ │ - Prevents unauthorized message access              │   │    │
│  │ └──────────────────────────────────────────────────────┘   │    │
│  │ ┌──────────────────────────────────────────────────────┐   │    │
│  │ │ Channel Authorization (routes/channels.php)          │   │    │
│  │ │ - Validates user is in conversation                 │   │    │
│  │ │ - Prevents eavesdropping                             │   │    │
│  │ └──────────────────────────────────────────────────────┘   │    │
│  └────────────────────────────────────────────────────────────┘    │
│                     │                                                │
│                     ▼                                                │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │              MODELS                                         │    │
│  │ ┌──────────────────────────────────────────────────────┐   │    │
│  │ │ Message                                              │   │    │
│  │ │ - sender() → User                                    │   │    │
│  │ │ - receiver() → User                                  │   │    │
│  │ │ - match() → SkillMatch                               │   │    │
│  │ └──────────────────────────────────────────────────────┘   │    │
│  │ ┌──────────────────────────────────────────────────────┐   │    │
│  │ │ SkillMatch                                           │   │    │
│  │ │ - userOne() → User                                   │   │    │
│  │ │ - userTwo() → User                                   │   │    │
│  │ │ - messages() → Message[]                             │   │    │
│  │ └──────────────────────────────────────────────────────┘   │    │
│  │ ┌──────────────────────────────────────────────────────┐   │    │
│  │ │ User                                                 │   │    │
│  │ │ - sentMessages() → Message[]                         │   │    │
│  │ │ - receivedMessages() → Message[]                     │   │    │
│  │ └──────────────────────────────────────────────────────┘   │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
            │
            │
            ▼
┌─────────────────────────────────────────────────────────────────────┐
│              DATABASE LAYER (MySQL)                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────┐  ┌──────────────────┐  ┌────────────────┐  │
│  │ users table        │  │ matches table    │  │ messages table │  │
│  ├────────────────────┤  ├──────────────────┤  ├────────────────┤  │
│  │ id                 │  │ id               │  │ id             │  │
│  │ name               │  │ user_one_id → ─ ─┼─►│ sender_id ──┐  │  │
│  │ email              │  │ user_two_id  ──┐└──►│ receiver_id  │  │  │
│  │ profile_photo      │  │ match_pct      │    │ match_id ──┐ │  │  │
│  │ ...                │  │ mutual_skills  │    │ body       │ │  │  │
│  └────────────────────┘  │ created_at     │    │ read_at    │ │  │  │
│           ▲              └──────────────────┘   │ created_at │ │  │  │
│           │                      ▲              └────────────┘ │  │  │
│           └──────────────────────┼──────────────────────────────┘  │  │
│                                  │                                  │  │
│                    Indexes for Performance:                         │  │
│                    - messages_match_created_at_index                │  │
│                    - messages_receiver_read_at_index                │  │
│                    - messages_sender_id_index                       │  │
│                    - messages_created_at_index                      │  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Message Flow Sequence Diagram

```
User A                  Browser A         Laravel Backend         Reverb Server         Browser B         User B
   │                        │                   │                      │                    │              │
   │── Type "Hello!" ────►   │                   │                      │                    │              │
   │                        │                   │                      │                    │              │
   │                        │── Subscribe ─────────────────────────────►│                    │              │
   │                        │  to private-chat.1                        │                    │              │
   │                        │                   │                      │              (subscribed)        │
   │                        │                   │                      │  ◄──────────────┘  │              │
   │                        │                   │                      │                    │              │
   │── Click Send ───►      │                   │                      │                    │              │
   │                        │── POST /api/messages ─────────────────────►│                    │              │
   │                        │   {"match_id":1,                          │                    │              │
   │                        │    "body":"Hello!"}                       │                    │              │
   │                        │                   │                      │                    │              │
   │                        │                   │── Save to DB ───────┐│                    │              │
   │                        │                   │  (Message record)    ││                    │              │
   │                        │                   │                   ┌──┘                    │              │
   │                        │                   │                   │                       │              │
   │                        │                   │── Dispatch MessageSent Event ──►│         │              │
   │                        │                   │  with message data              │         │              │
   │                        │                   │                                 │         │              │
   │                        │                   │         Broadcast to private-chat.1      │              │
   │                        │                   │                                          │              │
   │                        │  ◄─ 201 Created ──┤                                          │              │
   │                        │  {id:123, ...}    │                   ◄──────────────────────┤              │
   │                        │                   │                   (message.sent event)   │              │
   │                        │                   │                                          │── Update ──► │
   │                        │                   │                                          │  state &    │
   │ (waiting)              │                   │                                          │  render     │
   │                        │                   │                                          │              │
   │                        │  ◄──────────────────────────────────────────────────────────┤              │
   │                        │  (message received via WebSocket - message.sent event)      │              │
   │ ◄─ See message ────────┤  Message appears in ChatWindow in real-time!                │              │
   │  instantly             │  (NO page refresh needed!)                                  │              │
   │                        │                   │                                          │              │
```

## Component Relationship Diagram

```
Chat/Index.jsx
│
├── useState(matches)
│   └── Fetches from /api/matches
│
├── useState(selectedMatch)
│   └── Updated on match selection
│
├── useState(messages)
│   └── Updated via Echo events
│
├── useRef(echoRef)
│   └── Laravel Echo instance
│
├── useEffect for:
│   ├── Initialize Echo
│   ├── Fetch matches on mount
│   ├── Subscribe to real-time events
│   └── Cleanup on unmount
│
└── Render:
    ├── ConversationSidebar
    │   ├── Props: matches, selectedMatchId, onSelectMatch
    │   └── Renders: List of conversations
    │       └── MessageBubble (snippet)
    │
    └── ChatWindow
        ├── Props: match, messages, onSendMessage
        │
        └── Render:
            ├── Header
            │   └── User info + call icons
            │
            ├── Messages Area
            │   └── MessageBubble
            │       ├── Props: message, isOwn, sender, isRead
            │       └── Render: Message with timestamp & checkmark
            │
            ├── TypingIndicator
            │   ├── Props: typingUsers
            │   └── Render: Animated typing dots
            │
            └── ChatInput
                ├── Props: matchId, onSend
                ├── useState(message)
                ├── useTypingIndicator(matchId)
                └── Render: Text input + Send button
```

## Data Flow State Management

```
Chat/Index.jsx (Main State)
│
├─ selectedMatch
│  │  Type: SkillMatch | null
│  │  Updated by: onSelectMatch(match)
│  │  Used by: ChatWindow
│  │
│  └─ Triggers: fetchMessages() → GET /api/messages/{id}
│     └─ Updates: messages state
│
├─ matches
│  │  Type: SkillMatch[]
│  │  Fetched on mount: GET /api/matches
│  │  Updated by: Echo.private('chat.{id}').on('message.sent', ...)
│  │  Used by: ConversationSidebar
│  │
│  └─ Re-sort by latestMessage.created_at
│
├─ messages
│  │  Type: Message[]
│  │  Updated by 4 Event Listeners:
│  │  ├─ message.sent → setMessages(prev => [...prev, newMsg])
│  │  ├─ message.read → setMessages(prev => prev.map(msg => 
│  │  │                              msg.id === readId ? 
│  │  │                              {...msg, is_read: true} : msg))
│  │  └─ etc.
│  │
│  └─ Used by: ChatWindow to render MessageBubbles
│
└─ typingUsers
   │  Type: string[] (user names)
   │  Updated by:
   │  ├─ user.typing → setTypingUsers(prev => [...prev, userName])
   │  ├─ user.stopped-typing → setTypingUsers(prev => 
   │  │                        prev.filter(name => name !== userName))
   │  └─ Auto clear after 3 seconds
   │
   └─ Used by: TypingIndicator to show animation
```

## Channel Authorization Flow

```
User attempts to subscribe to private-chat.5
│
▼
Browser sends: /broadcasting/auth request
│
▼
Laravel Route: channels.php
│
▼
Broadcast::channel('chat.{conversationId}', function ($user, $id) {
│
▼
Query: SELECT * FROM matches 
       WHERE id = 5 
       AND (user_one_id = user_id OR user_two_id = user_id)
│
├─ YES ──► Return true ──► Browser subscribes
│          Echo.private('chat.5').on('message.sent', ...)
│
└─ NO ──► Return false ──► Browser blocked from channel
           "Unauthorized" error in console
```

## Real-Time Event Broadcasting

```
Event Dispatch (Backend)
│
▼
MessageSent::dispatch($message)
│
▼
Laravel Broadcasting System
│
▼
Check: implements ShouldBroadcast? YES
│
▼
broadcastOn(): [new PrivateChannel("chat.{$conversationId}")]
│
▼
broadcastAs(): 'message.sent'
│
▼
broadcastWith(): {...message data...}
│
▼
Send to Reverb/Pusher Server
│
▼
Reverb checks: Who is subscribed to private-chat.{id}?
│
▼
├─ Browser A: Subscribed ──► Send event data ──► React receives
│
└─ Browser B: Subscribed ──► Send event data ──► React receives
  
(Browsers not subscribed don't receive anything)
```

## Performance & Optimization

```
Query Optimization:
├─ MatchRepository.forUser()
│  ├─ Eager load: userOne, userTwo
│  ├─ Eager load: messages.latest(1)
│  └─ Result: 1 query instead of N+1
│
├─ Message Indexing
│  ├─ Index on (match_id, created_at)
│  │  └─ Fast: SELECT * FROM messages WHERE match_id = 1 ORDER BY created_at DESC
│  │
│  ├─ Index on (receiver_id, read_at)
│  │  └─ Fast: SELECT * FROM messages WHERE receiver_id = 2 AND read_at IS NULL
│  │
│  └─ Result: Queries complete in milliseconds
│
└─ Frontend Optimization
   ├─ Debounced typing (300ms)
   │  └─ Reduces API calls from ~100 to ~3 per second of typing
   │
   ├─ Message pagination (50 per load)
   │  └─ Reduces initial load from potentially 1000s to 50
   │
   ├─ React.memo on MessageBubble
   │  └─ Prevents re-render of non-changed messages
   │
   └─ useCallback for stable references
      └─ Prevents child re-renders
```

## Deployment Architecture

```
Production Setup:
│
├─ Load Balancer
│  └─ Distributes traffic to multiple instances
│
├─ Web Servers (Laravel)
│  ├─ Instance 1: Handles HTTP requests
│  ├─ Instance 2: Handles HTTP requests
│  └─ Instance N: Handles HTTP requests
│
├─ Reverb/Pusher Server
│  └─ Handles WebSocket connections
│     (Can be on separate server for scale)
│
├─ Queue Worker (Redis/Database)
│  └─ Processes events asynchronously
│     (if using QUEUE_CONNECTION=redis)
│
├─ Database (MySQL)
│  └─ Stores messages persistently
│
└─ Cache (Redis)
   └─ Stores session and cache data
```

This comprehensive architecture ensures:
- ✅ Real-time message delivery
- ✅ Scalability across multiple servers
- ✅ Security through channel authorization
- ✅ Performance through indexing and caching
- ✅ Reliability through database persistence
