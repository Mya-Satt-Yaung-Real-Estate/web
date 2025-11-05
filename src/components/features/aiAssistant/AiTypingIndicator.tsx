import { Sparkles } from 'lucide-react';

export function AiTypingIndicator() {
  return (
    <div className="flex items-center gap-3 mb-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border border-gray-200 shadow-sm">
        <Sparkles className="w-5 h-5 text-gray-600 animate-pulse" />
      </div>
      <div className="flex items-center gap-2 bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
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

