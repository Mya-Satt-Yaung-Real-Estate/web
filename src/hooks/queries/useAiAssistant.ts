import { useMutation } from '@tanstack/react-query';
import { aiAssistantApi } from '@/services/api/aiAssistant';
import type { AiChatRequest, AiChatResponse } from '@/types/aiAssistant';
import { toast } from 'sonner';

export const aiAssistantKeys = {
  all: ['ai-assistant'] as const,
  session: (sessionId: string) => ['ai-assistant', 'session', sessionId] as const,
};

export function useAiAssistantChat() {
  return useMutation<AiChatResponse, Error, AiChatRequest>({
    mutationFn: async (payload: AiChatRequest) => {
      const response = await aiAssistantApi.sendMessage(payload);
      return response.data.data || response.data;
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to send message';
      toast.error(errorMessage);
    },
  });
}

