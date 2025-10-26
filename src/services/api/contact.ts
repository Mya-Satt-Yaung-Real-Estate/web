import { apiClient } from './client';
import type { ContactFormData, ContactResponse } from '@/types/contact';

export const contactApi = {
  async submitContactForm(data: ContactFormData): Promise<ContactResponse> {
    const response = await apiClient.post<ContactResponse>('/api/v1/frontend/contact-us', data);
    return response.data;
  },
};


