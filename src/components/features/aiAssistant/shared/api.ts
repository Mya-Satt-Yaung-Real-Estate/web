import { api } from '@/services/api/client';
import type { AiChatRequest, AiChatApiResponse } from '@/types/aiAssistant';

export const aiAssistantApi = {
  sendMessage: (payload: AiChatRequest) => {
    return api.post<AiChatApiResponse>('/api/v1/frontend/ai-assistant/chat', payload);
  },
};

