/**
 * Loan Request Types
 * 
 * TypeScript interfaces for loan request API requests and responses.
 */

export interface CreateLoanRequestData {
  full_name: string;
  email: string;
  phone: string;
  nrc_number?: string;
  date_of_birth?: string;
  current_address?: string;
  occupation?: string;
  employer?: string;
  monthly_income?: number;
  work_experience?: number;
  requested_amount: number;
  loan_purpose: 'Home Purchase' | 'Home Construction' | 'Home Renovation' | 'Land Purchase' | 'Business Property';
  property_type_id?: number;
  property_value?: number;
  down_payment?: number;
  property_location?: string;
  additional_notes?: string;
  agree_terms: boolean;
  consent_personal_data: boolean;
  authorize_credit_check: boolean;
}

export interface LoanRequestResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    reference_number?: string;
    [key: string]: any;
  };
}

