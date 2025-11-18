import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { aiAssistantApi } from '../api';
import type { AiChatRequest, AiChatResponse } from '@/types/aiAssistant';

export const aiAssistantKeys = {
  chat: () => ['ai-assistant', 'chat'] as const,
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

