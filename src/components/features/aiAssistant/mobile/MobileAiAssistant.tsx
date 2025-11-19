import { useState, useEffect } from 'react';
import { MobileAiChatArea } from './MobileAiChatArea';
import { MobileAiInputArea } from './MobileAiInputArea';
import { useAiAssistantChat, aiAssistantApi, aiAssistantStorage } from '../shared';
import type { AiMessageDisplay, AiHistoryMessage } from '@/types/aiAssistant';

const WELCOME_MESSAGE: AiMessageDisplay = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm Jade's AI Assistant. I can help you find properties, analyze prices, and answer questions about real estate. What would you like to know?",
  timestamp: new Date(),
  isWelcome: true,
};

interface MobileAiAssistantProps {
  onClose?: () => void;
}

export function MobileAiAssistant({ onClose: _onClose }: MobileAiAssistantProps) {
  const [messages, setMessages] = useState<AiMessageDisplay[]>([WELCOME_MESSAGE]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const chatMutation = useAiAssistantChat();

  const generateMessageId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Transform history message to display format
  const transformHistoryMessage = (msg: AiHistoryMessage, index: number): AiMessageDisplay => {
    return {
      id: `history-${index}-${Date.now()}`,
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.timestamp),
      tools: msg.tools,
    };
  };

  // Load history on mount
  useEffect(() => {
    const loadHistory = async () => {
      const storedSessionId = aiAssistantStorage.getSessionId();
      
      if (!storedSessionId) {
        // No session, show welcome message
        return;
      }

      setIsLoadingHistory(true);
      try {
        const response = await aiAssistantApi.getHistory(storedSessionId);
        const historyData = response.data.data || response.data;
        
        if (historyData.messages && historyData.messages.length > 0) {
          // Transform history messages
          const historyMessages = historyData.messages.map((msg, index) => 
            transformHistoryMessage(msg, index)
          );
          
          // Set messages with history (no welcome message if history exists)
          setMessages(historyMessages);
          setSessionId(historyData.session_id || storedSessionId);
        } else {
          // No history, show welcome message
          setMessages([WELCOME_MESSAGE]);
          setSessionId(storedSessionId);
        }
      } catch (error) {
        // Session expired or error, clear and show welcome
        aiAssistantStorage.clearSessionId();
        setMessages([WELCOME_MESSAGE]);
        setSessionId(null);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, []);

  const handleSend = async (content: string) => {
    const userMessage: AiMessageDisplay = {
      id: generateMessageId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await chatMutation.mutateAsync({
        message: content,
        session_id: sessionId || undefined,
      });

      if (response.session_id) {
        setSessionId(response.session_id);
        aiAssistantStorage.setSessionId(response.session_id);
      }

      const aiMessage: AiMessageDisplay = {
        id: generateMessageId(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        tools: response.tools || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      // Show error as chat message instead of toast
      const statusCode = error?.response?.status || 500;
      const errorContent = statusCode === 429 
        ? 'Too many requests, Please try again later'
        : 'Try again later';
      
      const errorMessage: AiMessageDisplay = {
        id: generateMessageId(),
        role: 'assistant',
        content: errorContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden safe-area-top" data-chat-area>
        <MobileAiChatArea
          messages={messages}
          isLoading={chatMutation.isPending || isLoadingHistory}
          onQuickAction={handleSend}
        />
      </div>
      <MobileAiInputArea
        onSend={handleSend}
        isLoading={chatMutation.isPending}
        disabled={false}
      />
    </div>
  );
}

