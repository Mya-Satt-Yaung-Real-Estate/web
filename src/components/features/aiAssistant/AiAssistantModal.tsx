import { useState, useEffect } from 'react';
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
  'w-[calc(100vw-3rem)] sm:w-[400px] md:w-[450px] lg:w-[500px]',
  'max-w-[calc(100vw-3rem)] sm:max-w-[500px]',
  'h-[85vh] sm:h-[600px] md:h-[650px] lg:h-[700px]',
  'max-h-[90vh] sm:max-h-[85vh]',
  '!p-0 !flex !flex-col rounded-t-2xl sm:rounded-2xl',
  '!left-4 sm:!left-6 !bottom-4 sm:!bottom-6',
  '!translate-x-0 !translate-y-0',
  '!top-auto !right-auto',
  'overflow-hidden [&>button]:hidden border border-gray-200/50',
  'fixed z-50',
  'shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3),0_10px_40px_-10px_rgba(0,0,0,0.2)]',
].join(' ');

const WELCOME_MESSAGE: AiMessageDisplay = {
  id: 'welcome-message',
  role: 'assistant',
  content: "👋 Hello! I'm your AI Assistant. I can help you with property searches, pricing insights, market trends, loan calculations, and answer any questions about Jade Property platform. How can I assist you today?",
  timestamp: new Date(),
  isWelcome: true,
};

export function AiAssistantModal({ open, onOpenChange }: AiAssistantModalProps) {
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

  useEffect(() => {
    if (open) {
      const overlay = document.querySelector('[data-radix-dialog-overlay]');
      if (overlay) {
        (overlay as HTMLElement).style.background = 'transparent';
        (overlay as HTMLElement).style.pointerEvents = 'none';
      }
      
      // Ensure modal is positioned correctly and visible
      const dialogContent = document.querySelector('[data-radix-dialog-content]');
      if (dialogContent) {
        const element = dialogContent as HTMLElement;
        // Force positioning to bottom-left
        element.style.position = 'fixed';
        element.style.left = window.innerWidth < 640 ? '1rem' : '1.5rem';
        element.style.bottom = window.innerWidth < 640 ? '1rem' : '1.5rem';
        element.style.top = 'auto';
        element.style.right = 'auto';
        element.style.transform = 'none';
        element.style.margin = '0';
        // Ensure it doesn't overflow
        const maxWidth = window.innerWidth < 640 
          ? `${window.innerWidth - 32}px` 
          : window.innerWidth < 768 ? '400px' : window.innerWidth < 1024 ? '450px' : '500px';
        element.style.maxWidth = maxWidth;
      }
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
        <DialogContent 
          className={MODAL_CLASSES}
          size="2xl"
          onInteractOutside={(e) => {
            // Prevent modal from closing when clicking outside, but allow other interactions
            e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            onOpenChange(false);
          }}
        >
          <DialogTitle className="sr-only">AI Assistant</DialogTitle>
          <AiAssistantHeader onClose={() => onOpenChange(false)} />
          
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
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

