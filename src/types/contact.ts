export interface ContactFormData {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  category: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: any;
}



