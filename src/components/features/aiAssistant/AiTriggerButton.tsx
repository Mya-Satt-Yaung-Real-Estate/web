import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { AiAssistantModal } from './AiAssistantModal';
import { Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const GRADIENT_COLOR = 'linear-gradient(to right, oklch(0.558 0.288 302.321) 0%, oklch(0.546 0.245 262.881) 100%)';

interface AiTriggerButtonProps {
  className?: string;
}

export function AiTriggerButton({ className }: AiTriggerButtonProps) {
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setShowBubble(false);
      return;
    }

    const showBubbleWithDelay = () => {
      setShowBubble(true);
      
      timeoutRef.current = setTimeout(() => {
        setShowBubble(false);
      }, 4500);
    };

    showBubbleWithDelay();

    intervalRef.current = setInterval(() => {
      if (!isHovered && !open) {
        showBubbleWithDelay();
      }
    }, 15000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [open, isHovered]);

  const handleBubbleClose = () => {
    setShowBubble(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <>
      {!open && (
        <div
          className="fixed bottom-6 left-6 z-[9999]"
          onMouseEnter={() => {
            setIsHovered(true);
            setShowBubble(false);
          }}
          onMouseLeave={() => setIsHovered(false)}
        >
          {showBubble && (
            <div className="absolute bottom-full left-0 mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200 px-4 py-3 w-[200px] sm:w-[260px]">
                <button
                  onClick={handleBubbleClose}
                  className="absolute top-1.5 right-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-3 h-3" />
                </button>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pr-4">
                  👋 Hey! I'm your AI Assistant. Click me to get started!
                </p>
                <div className="absolute bottom-0 left-6 transform -translate-y-full">
                  <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
                </div>
              </div>
            </div>
          )}
          
          <Button
            onClick={() => setOpen(true)}
            className={cn(
              'h-14 w-14 rounded-full shadow-2xl',
              'hover:scale-110 transition-transform',
              'text-white',
              'ring-2 ring-primary/20 hover:ring-primary/40',
              'flex items-center justify-center p-0 !px-0',
              'animate-[float_3s_ease-in-out_infinite]',
              className
            )}
            style={{
              background: GRADIENT_COLOR,
            }}
            aria-label="Open AI Assistant"
          >
            <Sparkles className="w-6 h-6 flex-shrink-0 stroke-current" />
          </Button>
        </div>
      )}

      <AiAssistantModal open={open} onOpenChange={setOpen} />
      
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </>
  );
}

