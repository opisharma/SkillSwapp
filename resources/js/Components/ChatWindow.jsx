import { useState, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import { useAutoScroll, groupMessagesByDate, formatMessageTime } from '../Hooks/useMessaging';

export default function ChatWindow({ 
  match, 
  messages = [], 
  currentUserId, 
  typingUsers = [],
  onSendMessage,
  isLoading = false,
  error = null,
}) {
  const [localMessages, setLocalMessages] = useState(messages);
  const [loadingMore, setLoadingMore] = useState(false);
  const bottomRef = useAutoScroll([localMessages]);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  if (!match?.id) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <svg className="h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-slate-500">Select a conversation</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <svg className="h-8 w-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-slate-500">Loading messages...</p>
      </div>
    );
  }

  const otherUser = match.user_one_id === currentUserId ? match.userTwo : match.userOne;
  const groupedMessages = groupMessagesByDate(localMessages);
  const dateGroups = Object.keys(groupedMessages).sort((a, b) => new Date(a) - new Date(b));

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {otherUser?.profile_photo && (
              <img
                src={otherUser.profile_photo}
                alt={otherUser.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            )}
            <div>
              <h2 className="font-semibold text-slate-900">{otherUser?.name}</h2>
              <p className="text-xs text-slate-500">
                {typingUsers.includes(otherUser?.name) ? (
                  <span className="text-green-600 font-medium">typing...</span>
                ) : (
                  'Active now'
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="rounded-full p-2 hover:bg-slate-100 transition-colors">
              <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
            <button className="rounded-full p-2 hover:bg-slate-100 transition-colors">
              <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {localMessages.length === 0 && !error ? (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <svg className="h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-center text-slate-500">
              No messages yet.<br />
              <span className="text-sm">Start a conversation with {otherUser?.name}</span>
            </p>
          </div>
        ) : (
          <>
            {loadingMore && (
              <div className="flex justify-center py-4">
                <svg className="h-5 w-5 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            )}

            {dateGroups.map((dateKey, groupIndex) => (
              <div key={dateKey}>
                <div className="my-4 flex justify-center">
                  <span className="bg-white px-3 text-xs font-medium text-slate-500">
                    {new Date(dateKey).toLocaleDateString('en-US', { 
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                {groupedMessages[dateKey].map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.sender_id === currentUserId}
                    sender={message.sender}
                    isRead={!!message.is_read || message.sender_id === currentUserId}
                  />
                ))}
              </div>
            ))}
          </>
        )}

        <TypingIndicator typingUsers={typingUsers} />
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 bg-white px-6 py-4">
        <ChatInput
          matchId={match.id}
          onSend={onSendMessage}
          disabled={!match?.id}
          placeholder={`Message ${otherUser?.name}...`}
        />
      </div>
    </div>
  );
}
