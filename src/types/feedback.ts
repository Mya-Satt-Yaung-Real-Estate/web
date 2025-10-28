export interface FeedbackFormData {
  user_name: string;
  email: string;
  phone: string | null;
  feedback: string;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  data?: any;
}

