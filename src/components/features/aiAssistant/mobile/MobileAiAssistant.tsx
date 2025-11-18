import { useState } from 'react';
import { MobileAiChatArea } from './MobileAiChatArea';
import { MobileAiInputArea } from './MobileAiInputArea';
import { useAiAssistantChat } from '../shared';
import type { AiMessageDisplay } from '@/types/aiAssistant';

const WELCOME_MESSAGE: AiMessageDisplay = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm Jade's AI Assistant. I can help you find properties, analyze prices, and answer questions about real estate. What would you like to know?",
  timestamp: new Date(),
  isWelcome: true,
};

interface MobileAiAssistantProps {
  onClose: () => void;
}

export function MobileAiAssistant({ onClose }: MobileAiAssistantProps) {
  const [messages, setMessages] = useState<AiMessageDisplay[]>([WELCOME_MESSAGE]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const chatMutation = useAiAssistantChat();

  const generateMessageId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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
      }

      const aiMessage: AiMessageDisplay = {
        id: generateMessageId(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        tools: response.tools || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      // Error is handled by the mutation hook (toast notification)
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden safe-area-top" data-chat-area>
        <MobileAiChatArea
          messages={messages}
          isLoading={chatMutation.isPending}
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

