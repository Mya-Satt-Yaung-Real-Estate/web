export interface FAQ {
  id: number;
  question_en: string;
  question_mm: string;
  answer_en: string;
  answer_mm: string;
}

export interface FAQResponse {
  success: boolean;
  message: string;
  data: FAQ[];
}
