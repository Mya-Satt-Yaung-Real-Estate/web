import { useEffect, useRef } from 'react';
import { MobileAiMessageBubble } from './MobileAiMessageBubble';
import { MobileAiPropertyResults } from './MobileAiPropertyResults';
import { MobileAiFaqResults } from './MobileAiFaqResults';
import { MobileAiLegalResults } from './MobileAiLegalResults';
import { MobileAiCompanyResults } from './MobileAiCompanyResults';
import { MobileAiContactInformation } from './MobileAiContactInformation';
import { MobileAiEventResults } from './MobileAiEventResults';
import { MobileAiAdvertisementResults } from './MobileAiAdvertisementResults';
import { MobileAiNewsResults } from './MobileAiNewsResults';
import { MobileAiWantedResults } from './MobileAiWantedResults';
import { MobileAiTypingIndicator } from './MobileAiTypingIndicator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home, HelpCircle, Gavel, Building2, Calendar, Megaphone, Newspaper, Phone, Search, Star, TrendingUp } from 'lucide-react';
import type { AiMessageDisplay } from '@/types/aiAssistant';

const GRADIENT_COLOR_START = 'oklch(0.558 0.288 302.321)';

const QUICK_ACTIONS = [
  { icon: Home, label: 'Property Search', prompt: 'Find properties in Yangon' },
  { icon: TrendingUp, label: 'Popular Posts', prompt: 'Show me popular properties' },
  { icon: Star, label: 'Premium Properties', prompt: 'Find premium properties' },
  { icon: Search, label: 'Wanted Listing Search', prompt: 'Find wanted listings' },
  { icon: HelpCircle, label: 'FAQ Search', prompt: 'Show me frequently asked questions' },
  { icon: Gavel, label: 'Legal Search', prompt: 'Show me lawyers and legal professionals' },
  { icon: Building2, label: 'Company Search', prompt: 'Search for companies' },
  { icon: Calendar, label: 'Event Search', prompt: 'Find housing events' },
  { icon: Megaphone, label: 'Advertisement Search', prompt: 'Show me advertisements' },
  { icon: Newspaper, label: 'News Search', prompt: 'Show me latest news' },
  { icon: Phone, label: 'Contact Information', prompt: 'Show me contact information' },
] as const;

interface MobileAiChatAreaProps {
  messages: AiMessageDisplay[];
  isLoading: boolean;
  onQuickAction?: (action: string) => void;
}

export function MobileAiChatArea({ messages, isLoading, onQuickAction }: MobileAiChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  const shouldShowTimestamp = (currentIndex: number) => {
    if (currentIndex === 0) return true;
    const currentMessage = messages[currentIndex];
    const previousMessage = messages[currentIndex - 1];
    
    if (!currentMessage.timestamp || !previousMessage.timestamp) return true;
    
    const currentTime = new Date(currentMessage.timestamp).getTime();
    const previousTime = new Date(previousMessage.timestamp).getTime();
    const timeDiff = currentTime - previousTime;
    const fiveMinutes = 5 * 60 * 1000;
    
    return timeDiff > fiveMinutes || currentMessage.role !== previousMessage.role;
  };

  return (
    <div className="flex-1 min-h-0 overflow-hidden bg-gradient-to-b from-gray-50/20 via-white to-white flex flex-col">
      <ScrollArea className="w-full flex-1">
        <div className="px-4 py-5">
          {messages.map((message, index) => (
            <div key={message.id}>
              <div className="mb-1">
                <MobileAiMessageBubble 
                  message={message} 
                  showTimestamp={shouldShowTimestamp(index)}
                />
                {message.tools && message.tools.map((tool, toolIndex) => (
                  <div key={toolIndex} className={`${message.role === 'user' ? 'mr-12' : 'ml-12'} mt-2`}>
                    <MobileAiPropertyResults tool={tool} />
                    <MobileAiFaqResults tool={tool} />
                    <MobileAiLegalResults tool={tool} />
                    <MobileAiCompanyResults tool={tool} />
                    <MobileAiContactInformation tool={tool} />
                    <MobileAiEventResults tool={tool} />
                    <MobileAiAdvertisementResults tool={tool} />
                    <MobileAiNewsResults tool={tool} />
                    <MobileAiWantedResults tool={tool} />
                  </div>
                ))}
              </div>
              {message.isWelcome && index === 0 && onQuickAction && (
                <div className="ml-12 mt-4 mb-6">
                  <p className="text-sm font-semibold text-gray-800 mb-3.5 text-left">Quick Actions:</p>
                  <div className="grid grid-cols-2 gap-3 w-full">
                    {QUICK_ACTIONS.map((action, actionIndex) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={actionIndex}
                          onClick={() => onQuickAction?.(action.prompt)}
                          className="flex flex-row items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 active:shadow-lg active:scale-[0.97] transition-all duration-200 group text-left touch-manipulation hover:border-primary/30"
                          style={{
                            borderColor: 'rgb(229, 231, 235)',
                          }}
                          onTouchStart={(e) => {
                            e.currentTarget.style.borderColor = GRADIENT_COLOR_START;
                            e.currentTarget.style.transform = 'scale(0.97)';
                          }}
                          onTouchEnd={(e) => {
                            e.currentTarget.style.borderColor = 'rgb(229, 231, 235)';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <div 
                            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 shadow-sm"
                            style={{
                              background: `${GRADIENT_COLOR_START}15`,
                            }}
                          >
                            <Icon 
                              className="w-4 h-4 transition-colors" 
                              style={{ color: GRADIENT_COLOR_START }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-800 leading-tight">
                            {action.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
          {isLoading && <MobileAiTypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
}

