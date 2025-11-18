import { Sparkles } from 'lucide-react';

const GRADIENT_COLOR = 'linear-gradient(to right, oklch(0.558 0.288 302.321) 0%, oklch(0.546 0.245 262.881) 100%)';

export function MobileAiTypingIndicator() {
  return (
    <div className="flex gap-2.5 mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div 
        className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm"
        style={{ background: GRADIENT_COLOR }}
      >
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 flex items-center gap-1.5 bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-2.5 border border-gray-200/80">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.4s' }} />
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1.4s' }} />
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1.4s' }} />
        </div>
        <span className="text-[10px] text-gray-400 ml-1">AI is typing...</span>
      </div>
    </div>
  );
}

