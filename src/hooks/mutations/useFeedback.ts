import { useMutation } from '@tanstack/react-query';
import { feedbackApi } from '@/services/api/feedback';
import type { FeedbackFormData } from '@/types/feedback';

export const useFeedbackForm = () => {
  return useMutation({
    mutationFn: (data: FeedbackFormData) => feedbackApi.submitFeedback(data),
    onSuccess: () => {
      // Success handled in component
    },
    onError: (error) => {
      console.error('Feedback form submission failed:', error);
    },
  });
};
