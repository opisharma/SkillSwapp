import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook to manage auto-scroll to bottom
 */
export function useAutoScroll(dependency = []) {
  const bottomRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom, ...dependency]);

  return bottomRef;
}

/**
 * Hook to manage typing indicator with debounce
 */
export function useTypingIndicator(matchId, delayMs = 300) {
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const emitTyping = useCallback(() => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      fetch(`/api/messages/${matchId}/typing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
        },
      }).catch(err => console.error('Typing emit failed:', err));
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      fetch(`/api/messages/${matchId}/stop-typing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
        },
      }).catch(err => console.error('Stop typing emit failed:', err));
    }, delayMs);
  }, [matchId]);

  return emitTyping;
}

/**
 * Format timestamp for display
 */
export function formatMessageTime(timestamp) {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday ' + date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Group messages by date
 */
export function groupMessagesByDate(messages) {
  const grouped = {};
  
  messages.forEach(message => {
    const date = new Date(message.created_at);
    const dateKey = date.toDateString();
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(message);
  });

  return grouped;
}
