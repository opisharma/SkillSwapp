export default function TypingIndicator({ typingUsers = [] }) {
  if (typingUsers.length === 0) {
    return null;
  }

  const displayText = typingUsers.length === 1
    ? `${typingUsers[0]} is typing`
    : `${typingUsers.join(' and ')} are typing`;

  return (
    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
      <span>{displayText}</span>
      <div className="flex gap-1">
        <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
