import { formatMessageTime } from '../Hooks/useMessaging';

export default function MessageBubble({ 
  message, 
  isOwn, 
  sender,
  isRead 
}) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-xs gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isOwn && sender?.profile_photo && (
          <img
            src={sender.profile_photo}
            alt={sender.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        )}

        <div className={`rounded-2xl px-4 py-2 ${
          isOwn
            ? 'bg-blue-500 text-white'
            : 'bg-slate-100 text-slate-900'
        }`}>
          {!isOwn && sender && (
            <p className="text-xs font-semibold mb-1 opacity-75">
              {sender.name}
            </p>
          )}
          <p className="break-words whitespace-pre-wrap text-sm">
            {message.body}
          </p>
          <div className={`flex items-center gap-1 mt-1 ${
            isOwn ? 'justify-end' : 'justify-start'
          }`}>
            <p className={`text-xs ${
              isOwn ? 'text-blue-100' : 'text-slate-500'
            }`}>
              {formatMessageTime(message.created_at)}
            </p>
            {isOwn && (
              <svg
                className={`h-3.5 w-3.5 ${
                  isRead ? 'text-blue-100' : 'text-blue-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
