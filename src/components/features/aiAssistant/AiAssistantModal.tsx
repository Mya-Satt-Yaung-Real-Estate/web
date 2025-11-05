import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { AiAssistantHeader } from './AiAssistantHeader';
import { AiChatArea } from './AiChatArea';
import { AiInputArea } from './AiInputArea';
import { useAiAssistantChat } from '@/hooks/queries/useAiAssistant';
import type { AiMessageDisplay } from '@/types/aiAssistant';

interface AiAssistantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MODAL_CLASSES = [
  'max-w-[92vw] sm:max-w-[88vw] lg:max-w-[82vw] xl:max-w-[75vw]',
  'max-h-[88vh] sm:max-h-[82vh] lg:max-h-[80vh]',
  'w-full h-[88vh] sm:h-[82vh] lg:h-[80vh]',
  'p-0 flex flex-col rounded-2xl',
  'translate-x-[-50%] translate-y-[-50%] left-[50%] top-[50%]',
  'overflow-hidden [&>button]:hidden shadow-2xl border border-gray-200/50',
].join(' ');

export function AiAssistantModal({ open, onOpenChange }: AiAssistantModalProps) {
  const [messages, setMessages] = useState<AiMessageDisplay[]>([]);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={MODAL_CLASSES} size="2xl">
        <DialogTitle className="sr-only">AI Assistant</DialogTitle>
        <AiAssistantHeader onClose={() => onOpenChange(false)} />
        
        <div className="flex-1 min-h-0 overflow-hidden">
          <AiChatArea
            messages={messages}
            isLoading={chatMutation.isPending}
            onQuickAction={handleSend}
          />
        </div>

        <AiInputArea
          onSend={handleSend}
          isLoading={chatMutation.isPending}
          disabled={!open}
        />
      </DialogContent>
    </Dialog>
  );
}

