import { z } from 'zod';

const requiredNumber = (message: string) => z.preprocess(
  (value) => (value === '' || value === null || value === undefined ? undefined : value),
  z.coerce.number({ error: message }).min(0, message)
);

const requiredSelectNumber = (message: string) => z.preprocess(
  (value) => (value === '' || value === null || value === undefined ? undefined : value),
  z.coerce.number({ error: message }).int(message).min(1, message)
);

const requiredText = (message: string, maxMessage: string, max = 255) => z.string({ error: message })
  .trim()
  .min(1, message)
  .max(max, maxMessage);

export const projectFormSchema = (t: (key: string) => string) => z.object({
  title_en: requiredText(t('validation.titleEn.required'), t('validation.maxLength')),
  title_mm: requiredText('Project title (Myanmar) is required.', t('validation.maxLength')),
  property_type_id: requiredSelectNumber('Property type is required.'),
  region_id: requiredSelectNumber('Region is required.'),
  township_id: requiredSelectNumber('Township is required.'),
  address: requiredText('Address is required.', t('validation.maxLength'), 1000),
  total_units: requiredText('Total units is required.', t('validation.maxLength')),
  completion_text: requiredText('Completion is required.', t('validation.maxLength')),
  condition: z.enum(['under_construction', 'ongoing', 'upcoming']).default('upcoming'),
  publish_status: z.enum(['draft', 'published', 'unpublished']).default('draft'),
  price_min: requiredNumber('Minimum price is required.'),
  price_max: requiredNumber('Maximum price is required.'),
  currency: z.enum(['MMK', 'USD', 'THB', 'CNY']).default('MMK'),
  description_en: z.string({ error: 'Description (English) is required.' }).trim().min(1, 'Description (English) is required.'),
  description_mm: z.string({ error: 'Description (Myanmar) is required.' }).trim().min(1, 'Description (Myanmar) is required.'),
  contact_name: z.string().max(255, t('validation.maxLength')).optional().or(z.literal('')),
  contact_phone: z.string().max(255, t('validation.maxLength')).optional().or(z.literal('')),
  contact_email: z.preprocess(
    (value) => (value === '' || value === null || value === undefined ? undefined : value),
    z.string().email(t('validation.email.invalid')).optional()
  ),
  is_featured: z.boolean().default(false),
  show_on_homepage: z.boolean().default(false),
  media_ids: z.array(z.number()).min(1, 'Please upload at least one project image.').default([]),
  features: z.array(z.string()).default([]),
}).refine((data) => {
  if (data.price_min === undefined || data.price_max === undefined) {
    return true;
  }

  return data.price_max >= data.price_min;
}, {
  message: t('validation.maxPrice.gte') || 'Maximum price must be greater than or equal to minimum price.',
  path: ['price_max'],
});

export type ProjectFormValues = z.infer<ReturnType<typeof projectFormSchema>>;
