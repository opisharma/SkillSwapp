import { useState, useRef, useCallback } from 'react';
import { useTypingIndicator } from '../Hooks/useMessaging';

export default function ChatInput({ 
  matchId, 
  onSend, 
  disabled = false,
  placeholder = 'Type a message...'
}) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const emitTyping = useTypingIndicator(matchId);
  const inputRef = useRef(null);

  const handleChange = useCallback((e) => {
    setMessage(e.target.value);
    emitTyping();
  }, [emitTyping]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!message.trim() || isSending) {
      return;
    }

    setIsSending(true);
    setMessage('');

    try {
      await onSend(message.trim());
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  }, [message, isSending, onSend]);

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled || isSending}
        className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:bg-slate-50 disabled:text-slate-500"
      />
      <button
        type="submit"
        disabled={disabled || isSending || !message.trim()}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
      >
        {isSending ? (
          <>
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-4-2m4 2l4-2" />
            </svg>
            Send
          </>
        )}
      </button>
    </form>
  );
}
