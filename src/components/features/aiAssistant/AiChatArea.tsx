import { useEffect, useRef } from 'react';
import { AiMessageBubble } from './AiMessageBubble';
import { AiPropertyResults } from './AiPropertyResults';
import { AiTypingIndicator } from './AiTypingIndicator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Home, Search, MapPin } from 'lucide-react';
import type { AiMessageDisplay } from '@/types/aiAssistant';

interface AiChatAreaProps {
  messages: AiMessageDisplay[];
  isLoading: boolean;
  onQuickAction?: (action: string) => void;
}

const QUICK_ACTIONS = [
  { icon: Home, label: 'Find apartments', prompt: 'Find apartments in Yangon' },
  { icon: Search, label: 'Search properties', prompt: 'Search for condos under 500000 MMK' },
  { icon: MapPin, label: 'By location', prompt: 'Show me properties in Mandalay' },
] as const;

export function AiChatArea({ messages, isLoading, onQuickAction }: AiChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  return (
    <div className="flex-1 min-h-0 overflow-hidden bg-gradient-to-b from-gray-50/30 via-white to-white flex flex-col">
      <ScrollArea className="w-full flex-1">
        <div className="p-4 md:p-5 lg:p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="relative mb-5">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-xl">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hello! I'm your AI Assistant</h3>
              <p className="text-gray-600 max-w-md mb-6 leading-relaxed text-sm">
                I can help you find properties, answer questions, and assist with your real estate needs.
                How can I help you today?
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 w-full max-w-2xl">
                {QUICK_ACTIONS.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => onQuickAction?.(action.prompt)}
                      className="flex items-center gap-2.5 p-3 bg-white rounded-lg border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all duration-200 text-left group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                        {action.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id} className="mb-2">
                  <AiMessageBubble message={message} />
                  {message.tools && message.tools.map((tool, toolIndex) => (
                    <div key={toolIndex} className="ml-12 mt-2">
                      <AiPropertyResults tool={tool} />
                    </div>
                  ))}
                </div>
              ))}
              {isLoading && <AiTypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

