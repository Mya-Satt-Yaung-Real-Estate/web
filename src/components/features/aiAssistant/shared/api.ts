import { api } from '@/services/api/client';
import type { AiChatRequest, AiChatApiResponse, AiHistoryApiResponse } from '@/types/aiAssistant';

export const aiAssistantApi = {
  sendMessage: (payload: AiChatRequest) => {
    return api.post<AiChatApiResponse>('/api/v1/frontend/ai-assistant/chat', payload);
  },
  getHistory: (sessionId: string) => {
    return api.get<AiHistoryApiResponse>(`/api/v1/frontend/ai-assistant/history?session_id=${sessionId}`);
  },
};

