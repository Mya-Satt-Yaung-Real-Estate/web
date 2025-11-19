import { useMutation } from '@tanstack/react-query';
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
    // Error handling is done in components to show as chat messages
  });
}

