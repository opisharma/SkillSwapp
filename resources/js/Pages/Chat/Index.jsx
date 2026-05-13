import React, { useEffect, useState, useCallback, useRef } from 'react';
import AppLayout from '../../Layouts/AppLayout';
import ConversationSidebar from '../../Components/ConversationSidebar';
import ChatWindow from '../../Components/ChatWindow';

export default function ChatPage(props) {
  const auth = props.auth;
  const initialMatch = props.initialMatch || props.match || null;
  const initialMessages = props.initialMessages || props.messages || [];
  const initialMatches = props.matches || props.initialMatches || [];
  const currentUserId = auth?.user?.id;
  const [selectedMatch, setSelectedMatch] = useState(initialMatch);
  const [messages, setMessages] = useState(initialMessages);
  const [matches, setMatches] = useState(Array.isArray(initialMatches) && initialMatches.length > 0 ? initialMatches : (initialMatch ? [initialMatch] : []));
  const [typingUsers, setTypingUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState(null);
  const echoRef = useRef(null);
  const typingTimeoutsRef = useRef({});

  // Initialize Echo
  useEffect(() => {
    if (window.Echo && !echoRef.current) {
      echoRef.current = window.Echo;
    }
  }, []);

  // Fetch matches on mount
  useEffect(() => {
    if (Array.isArray(initialMatches) && initialMatches.length > 0) {
      return;
    }

    const fetchMatches = async () => {
      try {
        setMatchesLoading(true);
        const response = await window.fetch('/api/matches', {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch matches');

        const data = await response.json();
        const matchesData = Array.isArray(data) ? data : data.data || [];
        setMatches(matchesData);

        // Select first match if none selected
        setSelectedMatch((currentMatch) => currentMatch ?? matchesData[0] ?? null);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Failed to load conversations');
      } finally {
        setMatchesLoading(false);
      }
    };

    fetchMatches();
  }, [initialMatches]);

  // Fetch messages when match changes
  useEffect(() => {
    if (!selectedMatch?.id) return;

    if (initialMatch?.id === selectedMatch.id && Array.isArray(initialMessages) && initialMessages.length > 0) {
      return;
    }

    const fetchMessages = async () => {
      try {
        setMessagesLoading(true);
        setError(null);
        const response = await window.fetch(`/api/messages/${selectedMatch.id}`, {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch messages');

        const data = await response.json();
        setMessages(data.data || []);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchMessages();
  }, [initialMatch?.id, initialMessages, selectedMatch?.id]);

  // Subscribe to real-time events
  useEffect(() => {
    if (!selectedMatch?.id || !echoRef.current) return;

    const channelName = `chat.${selectedMatch.id}`;

    const channel = echoRef.current.private(channelName);

    // Listen for new messages
    channel.listen('.message.sent', (data) => {
      console.log('Message received:', data);
      setMessages(prev => [...prev, {
        id: data.id,
        match_id: data.match_id,
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        body: data.body,
        is_read: data.is_read,
        created_at: data.created_at,
        sender: data.sender,
      }]);
    });

    // Listen for read receipts
    channel.listen('.message.read', (data) => {
      console.log('Message read:', data);
      setMessages(prev => prev.map(msg =>
        msg.id === data.message_id
          ? { ...msg, is_read: true }
          : msg
      ));
    });

    // Listen for typing
    channel.listen('.user.typing', (data) => {
      console.log('User typing:', data);
      if (data.user_id !== currentUserId) {
        setTypingUsers(prev => {
          if (!prev.includes(data.user_name)) {
            return [...prev, data.user_name];
          }
          return prev;
        });

        // Clear existing timeout for this user
        if (typingTimeoutsRef.current[data.user_id]) {
          window.clearTimeout(typingTimeoutsRef.current[data.user_id]);
        }

        // Set timeout to remove typing indicator
        typingTimeoutsRef.current[data.user_id] = window.setTimeout(() => {
          setTypingUsers(prev => prev.filter(name => name !== data.user_name));
          delete typingTimeoutsRef.current[data.user_id];
        }, 3000);
      }
    });

    // Listen for stopped typing
    channel.listen('.user.stopped-typing', (data) => {
      console.log('User stopped typing:', data);
      if (data.user_id !== currentUserId) {
        if (typingTimeoutsRef.current[data.user_id]) {
          window.clearTimeout(typingTimeoutsRef.current[data.user_id]);
          delete typingTimeoutsRef.current[data.user_id];
        }
        setTypingUsers(prev =>
          prev.filter(name => !name.includes(data.user_id.toString()))
        );
      }
    });

    return () => {
      echoRef.current?.leaveChannel(channelName);
    };
  }, [selectedMatch?.id, currentUserId]);

  // Cleanup typing timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(typingTimeoutsRef.current).forEach(timeout => window.clearTimeout(timeout));
    };
  }, []);

  // Global incoming message fallback (dispatched by AppLayout subscriptions)
  useEffect(() => {
    const handler = (e) => {
      const data = e?.detail || e?.detail?.detail || null;
      if (!data || !data.match_id) return;

      if (selectedMatch?.id && selectedMatch.id === data.match_id) {
        setMessages((current) => (current.some((m) => m.id === data.id) ? current : [...current, data]));
      }
    };

    window.addEventListener('chat:message', handler);
    return () => window.removeEventListener('chat:message', handler);
  }, [selectedMatch?.id]);

  const handleSendMessage = useCallback(async (body) => {
    if (!selectedMatch?.id || !body.trim()) return;

    try {
      setError(null);
      const response = await window.fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
        },
        body: JSON.stringify({
          match_id: selectedMatch.id,
          body: body.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      setMessages((current) => (
        current.some((message) => message.id === data.id)
          ? current
          : [...current, data]
      ));

      console.log('Message sent:', data);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    }
  }, [selectedMatch?.id]);

  const handleSelectMatch = useCallback((match) => {
    setSelectedMatch(match);
    setTypingUsers([]);
    setError(null);
  }, []);

  return (
    <AppLayout>
      <div className="hidden h-full flex-col lg:flex lg:flex-row">
        {/* Sidebar */}
        <ConversationSidebar
          matches={matches}
          selectedMatchId={selectedMatch?.id}
          onSelectMatch={handleSelectMatch}
          unreadCounts={unreadCounts}
          currentUserId={currentUserId}
          loading={matchesLoading && matches.length === 0}
        />

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          <ChatWindow
            match={selectedMatch}
            messages={messages}
            currentUserId={currentUserId}
            typingUsers={typingUsers}
            onSendMessage={handleSendMessage}
            isLoading={messagesLoading && messages.length === 0}
            error={error}
          />
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        {!selectedMatch ? (
          <ConversationSidebar
            matches={matches}
            selectedMatchId={selectedMatch?.id}
            onSelectMatch={handleSelectMatch}
            unreadCounts={unreadCounts}
            currentUserId={currentUserId}
            loading={matchesLoading && matches.length === 0}
          />
        ) : (
          <div className="h-full flex flex-col">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-3">
              <button
                onClick={() => setSelectedMatch(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="font-semibold text-slate-900">
                {selectedMatch.user_one_id === currentUserId
                  ? selectedMatch.userTwo?.name
                  : selectedMatch.userOne?.name}
              </h2>
            </div>
            <ChatWindow
              match={selectedMatch}
              messages={messages}
              currentUserId={currentUserId}
              typingUsers={typingUsers}
              onSendMessage={handleSendMessage}
              isLoading={messagesLoading && messages.length === 0}
              error={error}
            />
          </div>
        )}
      </div>

      {/* Hidden data for client-side use */}
      <div
        data-current-user={JSON.stringify({ id: currentUserId })}
        style={{ display: 'none' }}
      />
    </AppLayout>
  );
}
