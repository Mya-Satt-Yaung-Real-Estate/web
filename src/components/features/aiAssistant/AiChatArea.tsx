import { useEffect, useRef } from 'react';
import { AiMessageBubble } from './AiMessageBubble';
import { AiPropertyResults } from './AiPropertyResults';
import { AiFaqResults } from './AiFaqResults';
import { AiLegalResults } from './AiLegalResults';
import { AiCompanyResults } from './AiCompanyResults';
import { AiContactInformation } from './AiContactInformation';
import { AiEventResults } from './AiEventResults';
import { AiAdvertisementResults } from './AiAdvertisementResults';
import { AiNewsResults } from './AiNewsResults';
import { AiWantedResults } from './AiWantedResults';
import { AiTypingIndicator } from './AiTypingIndicator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home, HelpCircle, Gavel, Building2, Calendar, Megaphone, Newspaper, Phone, Search, Star } from 'lucide-react';
import type { AiMessageDisplay } from '@/types/aiAssistant';

const GRADIENT_COLOR_START = 'oklch(0.558 0.288 302.321)';

const QUICK_ACTIONS = [
  { icon: Home, label: 'Property Search', prompt: 'Find properties in Yangon' },
  { icon: Star, label: 'Premium Properties', prompt: 'Find premium properties' },
  { icon: Search, label: 'Wanted Listing Search', prompt: 'Find wanted listings' },
  { icon: HelpCircle, label: 'FAQ Search', prompt: 'Search frequently asked questions' },
  { icon: Gavel, label: 'Legal Search', prompt: 'Find lawyers near me' },
  { icon: Building2, label: 'Company Search', prompt: 'Search for companies' },
  { icon: Calendar, label: 'Event Search', prompt: 'Find housing events' },
  { icon: Megaphone, label: 'Advertisement Search', prompt: 'Show me advertisements' },
  { icon: Newspaper, label: 'News Search', prompt: 'Show me latest news' },
  { icon: Phone, label: 'Contact Information', prompt: 'Show me contact information' },
] as const;

interface AiChatAreaProps {
  messages: AiMessageDisplay[];
  isLoading: boolean;
  onQuickAction?: (action: string) => void;
}

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
          {messages.map((message, index) => (
            <div key={message.id}>
              <div className="mb-2">
                <AiMessageBubble message={message} />
                {message.tools && message.tools.map((tool, toolIndex) => (
                  <div key={toolIndex} className="ml-12 mt-2">
                    <AiPropertyResults tool={tool} />
                    <AiFaqResults tool={tool} />
                    <AiLegalResults tool={tool} />
                    <AiCompanyResults tool={tool} />
                    <AiContactInformation tool={tool} />
                    <AiEventResults tool={tool} />
                    <AiAdvertisementResults tool={tool} />
                    <AiNewsResults tool={tool} />
                    <AiWantedResults tool={tool} />
                  </div>
                ))}
              </div>
              {message.isWelcome && index === 0 && onQuickAction && (
                <div className="ml-12 mt-3 mb-5">
                  <p className="text-sm font-medium text-gray-700 mb-3 text-left">Quick Actions:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full">
                    {QUICK_ACTIONS.map((action, actionIndex) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={actionIndex}
                          onClick={() => onQuickAction?.(action.prompt)}
                          className="flex flex-row items-center gap-1.5 p-2.5 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 group text-left"
                          style={{
                            borderColor: 'rgb(229, 231, 235)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = GRADIENT_COLOR_START;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgb(229, 231, 235)';
                          }}
                        >
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                            style={{
                              background: `${GRADIENT_COLOR_START}1A`,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = `${GRADIENT_COLOR_START}33`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = `${GRADIENT_COLOR_START}1A`;
                            }}
                          >
                            <Icon 
                              className="w-4 h-4 transition-colors" 
                              style={{ color: GRADIENT_COLOR_START }}
                            />
                          </div>
                          <span 
                            className="text-xs font-medium text-gray-700 transition-colors leading-tight"
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = GRADIENT_COLOR_START;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = 'rgb(55, 65, 81)';
                            }}
                          >
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
          {isLoading && <AiTypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
}

