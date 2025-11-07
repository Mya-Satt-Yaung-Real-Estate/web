import { z } from 'zod';

// Base profile schema (common for both individual and company)
const baseProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  media_id: z.number().optional().nullable(),
});

// Company profile schema
export const companyProfileSchema = baseProfileSchema.extend({
  company_name: z.string().min(1, 'Company name is required'),
  company_type_id: z.number().min(1, 'Company type is required'),
  address: z.string().min(1, 'Address is required'),
  region_id: z.number().min(1, 'Region is required'),
  township_id: z.number().min(1, 'Township is required'),
  description: z.string().optional(),
});

// Individual profile schema
export const individualProfileSchema = baseProfileSchema;

// Union type for profile schema
export type CompanyProfileFormData = z.infer<typeof companyProfileSchema>;
export type IndividualProfileFormData = z.infer<typeof individualProfileSchema>;

