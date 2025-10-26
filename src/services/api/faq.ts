import { apiClient } from './client';
import type { FAQResponse } from '@/types/faq';

export const faqApi = {
  async getFAQs(): Promise<FAQResponse> {
    const response = await apiClient.get<FAQResponse>('/api/v1/frontend/faqs');
    return response.data;
  },
};
