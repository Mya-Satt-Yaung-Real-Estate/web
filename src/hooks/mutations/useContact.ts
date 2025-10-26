import { useMutation } from '@tanstack/react-query';
import { contactApi } from '@/services/api/contact';
import type { ContactFormData } from '@/types/contact';

export const useContactForm = () => {
  return useMutation({
    mutationFn: (data: ContactFormData) => contactApi.submitContactForm(data),
    onSuccess: () => {
      // Success handled in component
    },
    onError: (error) => {
      console.error('Contact form submission failed:', error);
    },
  });
};



