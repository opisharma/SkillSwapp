import { useMemo } from 'react';

export default function ConversationSidebar({ 
  matches = [], 
  selectedMatchId, 
  onSelectMatch,
  unreadCounts = {},
  typingMatches = {},
  currentUserId = null,
  loading = false,
}) {
  // Sort matches by most recent first, considering typing status
  const sortedMatches = useMemo(() => {
    return [...matches].sort((a, b) => {
      const aTime = new Date(a.latestMessage?.created_at || a.created_at).getTime();
      const bTime = new Date(b.latestMessage?.created_at || b.created_at).getTime();
      return bTime - aTime;
    });
  }, [matches]);

  if (loading) {
    return (
      <div className="w-80 border-r border-slate-200 bg-slate-50 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <div className="h-10 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="flex-1 space-y-2 p-2 overflow-y-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 bg-white rounded-lg space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-slate-200 bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900">Messages</h1>
          <button className="rounded-full p-2 hover:bg-slate-100 transition-colors">
            <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 bg-white border-b border-slate-200">
        <input
          type="search"
          placeholder="Search conversations..."
          className="w-full rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-sm placeholder-slate-500 focus:border-blue-500 focus:bg-white focus:outline-none"
        />
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {sortedMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <svg className="h-12 w-12 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-slate-500">No conversations yet</p>
            <p className="text-xs text-slate-400 mt-1">Start matching to begin chatting</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {sortedMatches.map((match) => {
              const isSelected = match.id === selectedMatchId;
              const otherUser = currentUserId && match.user_one_id === currentUserId
                ? match.userTwo
                : match.userOne;
              const unreadCount = unreadCounts[match.id] || 0;
              const isTyping = typingMatches[match.id] || false;

              return (
                <button
                  key={match.id}
                  onClick={() => onSelectMatch(match)}
                  className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                    isSelected
                      ? 'bg-white shadow-sm'
                      : 'hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    {otherUser?.profile_photo && (
                      <img
                        src={otherUser.profile_photo}
                        alt={otherUser.name}
                        className="h-12 w-12 rounded-full object-cover mt-1 flex-shrink-0"
                      />
                    )}

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {otherUser?.name}
                        </h3>
                        {match.latestMessage && (
                          <span className="text-xs text-slate-500 flex-shrink-0">
                            {new Date(match.latestMessage.created_at).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </span>
                        )}
                      </div>

                      {/* Preview or Typing */}
                      <p className={`text-sm truncate ${
                        isTyping
                          ? 'text-green-600 font-medium'
                          : unreadCount > 0
                            ? 'text-slate-900 font-medium'
                            : 'text-slate-500'
                      }`}>
                        {isTyping ? (
                          <span>typing...</span>
                        ) : (
                          match.latestMessage?.body || 'No messages yet'
                        )}
                      </p>
                    </div>

                    {/* Unread Badge */}
                    {unreadCount > 0 && (
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
