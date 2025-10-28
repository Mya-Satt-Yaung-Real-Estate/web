import { apiClient } from './client';
import type { FeedbackFormData, FeedbackResponse } from '@/types/feedback';

export const feedbackApi = {
  async submitFeedback(data: FeedbackFormData): Promise<FeedbackResponse> {
    const response = await apiClient.post<FeedbackResponse>('/api/v1/feedbacks', data);
    return response.data;
  },
};

