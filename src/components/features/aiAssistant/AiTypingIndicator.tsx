import { Sparkles } from 'lucide-react';

const GRADIENT_COLOR = 'linear-gradient(to right, oklch(0.558 0.288 302.321) 0%, oklch(0.546 0.245 262.881) 100%)';

export function AiTypingIndicator() {
  return (
    <div className="flex items-center gap-3 mb-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div 
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
        style={{ background: GRADIENT_COLOR }}
      >
        <Sparkles 
          className="w-5 h-5 text-white animate-pulse" 
        />
      </div>
      <div className="flex items-center gap-2 bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-200">
        <div className="flex gap-1.5">
          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span className="text-sm text-gray-500 ml-2">AI is thinking...</span>
      </div>
    </div>
  );
}

