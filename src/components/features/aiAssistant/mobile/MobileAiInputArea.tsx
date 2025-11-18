import { useState, type KeyboardEvent, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

const GRADIENT_COLOR = 'linear-gradient(to right, oklch(0.558 0.288 302.321) 0%, oklch(0.546 0.245 262.881) 100%)';
const GRADIENT_COLOR_START = 'oklch(0.558 0.288 302.321)';

interface MobileAiInputAreaProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const MAX_TEXTAREA_HEIGHT = 100;

export function MobileAiInputArea({ onSend, isLoading, disabled }: MobileAiInputAreaProps) {
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
    <div className="flex-shrink-0 border-t border-gray-200/80 bg-white/95 backdrop-blur-sm safe-area-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="px-4 py-3.5">
        <div className="flex gap-2.5 items-end">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="min-h-[48px] max-h-[100px] resize-none py-3 px-4 border-gray-200 rounded-2xl shadow-sm transition-all text-sm bg-gray-50/50 focus:bg-white"
              style={{
                '--tw-ring-color': GRADIENT_COLOR_START,
              } as React.CSSProperties & { '--tw-ring-color': string }}
              onFocus={(e) => {
                e.target.style.borderColor = GRADIENT_COLOR_START;
                e.target.style.boxShadow = `0 0 0 3px ${GRADIENT_COLOR_START}25`;
                e.target.style.backgroundColor = 'white';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '';
                e.target.style.boxShadow = '';
                e.target.style.backgroundColor = '';
              }}
              disabled={isLoading || disabled}
              rows={1}
            />
            {message.length > 0 && (
              <span className="absolute bottom-2 right-3 text-[10px] text-gray-400">
                {message.length}
              </span>
            )}
          </div>
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isLoading || disabled}
            className="h-[48px] w-[48px] rounded-2xl shadow-md hover:shadow-lg active:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 text-white active:scale-95"
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
      </div>
    </div>
  );
}

