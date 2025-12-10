import { memo, useState } from 'react';
import { User, Sparkles, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { AiMessageDisplay } from '@/types/aiAssistant';

const GRADIENT_COLOR = 'linear-gradient(to right, oklch(0.558 0.288 302.321) 0%, oklch(0.546 0.245 262.881) 100%)';

interface MobileAiMessageBubbleProps {
  message: AiMessageDisplay;
  showTimestamp?: boolean;
}

export const MobileAiMessageBubble = memo(function MobileAiMessageBubble({ message, showTimestamp = true }: MobileAiMessageBubbleProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success('Message copied');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div 
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
          isUser 
            ? 'bg-primary text-white ring-2 ring-primary/20' 
            : ''
        }`}
        style={!isUser ? { background: GRADIENT_COLOR } : {}}
      >
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-white" />}
      </div>

      <div className={`flex-1 ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className="relative group">
          <div 
            className={`rounded-2xl px-4 py-2.5 shadow-sm ${
              isUser
                ? 'text-white rounded-tr-sm'
                : 'bg-gray-50 text-gray-900 rounded-tl-sm border border-gray-200/80'
            }`}
            style={isUser ? { background: GRADIENT_COLOR } : {}}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className={`absolute top-1 ${isUser ? 'left-1' : 'right-1'} h-7 w-7 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white`}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-gray-600" />
            )}
          </Button>
        </div>
        {showTimestamp && message.timestamp && (
          <span className={`text-[10px] text-gray-400 px-2 ${isUser ? 'text-right' : 'text-left'}`}>
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

