/**
 * Loan Request Validation Schema
 * 
 * Zod schema for loan request form validation.
 */

import { z } from 'zod';

export const createLoanRequestSchema = (t: (key: string) => string) => z.object({
  // Personal Information - all required
  full_name: z.string().min(1, t('validation.fullName.required')),
  email: z.string().email(t('validation.email.invalid')).min(1, t('validation.email.required')),
  phone: z.string().min(1, t('validation.phone.required')).regex(/^\+?[0-9]{1,13}$/, t('validation.phoneNumbers.invalid')),
  nrc_number: z.string().min(1, t('validation.nrcNumber.required')),
  date_of_birth: z.string().min(1, t('validation.dateOfBirth.required')),
  current_address: z.string().min(1, t('validation.currentAddress.required')),
  
  // Employment Information - all required
  occupation: z.string().min(1, t('validation.occupation.required')),
  employer: z.string().min(1, t('validation.employer.required')),
  monthly_income: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number({ message: t('validation.monthlyIncome.required') }).min(1, t('validation.monthlyIncome.required'))
  ),
  work_experience: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number({ message: t('validation.workExperience.required') }).min(0, t('validation.workExperience.required'))
  ),
  
  // Loan Information - all required
  requested_amount: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number({ message: t('validation.requestedAmount.required') }).min(1, t('validation.requestedAmount.required'))
  ),
  loan_purpose: z.enum(['Home Purchase', 'Home Construction', 'Home Renovation', 'Land Purchase', 'Business Property'], {
    message: t('validation.loanPurpose.required'),
  }),
  
  // Property Information - property_type_id is optional, others required
  property_type_id: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined || val === 'all') return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number().optional()
  ),
  property_value: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number({ message: t('validation.propertyValue.required') }).min(1, t('validation.propertyValue.required'))
  ),
  property_location: z.string().min(1, t('validation.propertyLocation.required')),
  down_payment: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number({ message: t('validation.downPayment.required') }).min(1, t('validation.downPayment.required'))
  ),
  
  // Additional Information - optional
  additional_notes: z.string().optional(),
  
  // Consent - all required
  agree_terms: z.boolean().refine(val => val === true, {
    message: t('validation.agreeTerms'),
  }),
  consent_personal_data: z.boolean().refine(val => val === true, {
    message: t('validation.consentPersonalData'),
  }),
  authorize_credit_check: z.boolean().refine(val => val === true, {
    message: t('validation.authorizeCreditCheck'),
  }),
});

export type LoanRequestFormData = z.infer<ReturnType<typeof createLoanRequestSchema>>;
