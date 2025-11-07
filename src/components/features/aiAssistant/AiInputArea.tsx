import { useState, type KeyboardEvent, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

const GRADIENT_COLOR = 'linear-gradient(to right, oklch(0.558 0.288 302.321) 0%, oklch(0.546 0.245 262.881) 100%)';
const GRADIENT_COLOR_START = 'oklch(0.558 0.288 302.321)';

interface AiInputAreaProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const MAX_TEXTAREA_HEIGHT = 120;

export function AiInputArea({ onSend, isLoading, disabled }: AiInputAreaProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
    }
  }, [message]);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading || disabled) {
      return;
    }
    onSend(trimmedMessage);
    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-shrink-0 border-t border-gray-200 bg-white/98 backdrop-blur-sm shadow-lg mt-auto">
      <div className="px-4 py-3">
        <div className="flex gap-3 items-end max-w-6xl mx-auto">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about properties..."
              className="min-h-[48px] max-h-[120px] resize-none py-2.5 border-gray-200 rounded-xl shadow-sm transition-all text-sm"
              style={{
                '--tw-ring-color': GRADIENT_COLOR_START,
              } as React.CSSProperties & { '--tw-ring-color': string }}
              onFocus={(e) => {
                e.target.style.borderColor = GRADIENT_COLOR_START;
                e.target.style.boxShadow = `0 0 0 2px ${GRADIENT_COLOR_START}40`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '';
                e.target.style.boxShadow = '';
              }}
              disabled={isLoading || disabled}
              rows={1}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isLoading || disabled}
            className="h-[48px] w-[48px] rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 text-white"
            style={{
              background: GRADIENT_COLOR,
              opacity: (!message.trim() || isLoading || disabled) ? 0.5 : 1,
            }}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-1.5">
          AI responses are generated and may not always be accurate
        </p>
      </div>
    </div>
  );
}

