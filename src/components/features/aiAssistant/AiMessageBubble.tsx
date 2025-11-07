import { memo } from 'react';
import { User, Sparkles } from 'lucide-react';
import type { AiMessageDisplay } from '@/types/aiAssistant';

const GRADIENT_COLOR = 'linear-gradient(to right, oklch(0.558 0.288 302.321) 0%, oklch(0.546 0.245 262.881) 100%)';

interface AiMessageBubbleProps {
  message: AiMessageDisplay;
}

export const AiMessageBubble = memo(function AiMessageBubble({ message }: AiMessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-5 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div 
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105 ${
          isUser 
            ? 'bg-primary text-white ring-2 ring-primary/20' 
            : ''
        }`}
        style={!isUser ? { background: GRADIENT_COLOR } : {}}
      >
        {isUser ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5 text-white" />}
      </div>

      <div className={`flex-1 max-w-[78%] md:max-w-[68%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
        <div 
          className={`rounded-2xl px-4 py-3 shadow-sm transition-all hover:shadow-md ${
            isUser
              ? 'text-white rounded-tr-sm'
              : 'bg-gray-100 text-gray-900 rounded-tl-sm border border-gray-200'
          }`}
          style={isUser ? { background: GRADIENT_COLOR } : {}}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        {message.timestamp && (
          <span className={`text-xs text-gray-400 px-2 ${isUser ? 'text-right' : 'text-left'}`}>
            {new Date(message.timestamp).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>
    </div>
  );
});

