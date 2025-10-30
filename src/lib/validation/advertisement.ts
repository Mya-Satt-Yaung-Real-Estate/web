import { z } from 'zod';

export const createAdvertisementSchema = (t: (key: string) => string) => z.object({
  title_en: z.string().min(1, t('validation.titleEn.required')).max(255, t('validation.maxLength')),
  title_mm: z.string().min(1, t('validation.titleMm.required')).max(255, t('validation.maxLength')),
  description: z.string().min(1, t('validation.description.required')).max(2000, t('validation.maxLength')),
  region_id: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? 0 : val),
    z.coerce.number().min(1, t('validation.required'))
  ),
  township_id: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? 0 : val),
    z.coerce.number().min(1, t('validation.required'))
  ),
  address: z.string().min(1, t('validation.address.required')).max(500, t('validation.maxLength')),
  contact_name: z.string().min(1, t('validation.contactName.required')).max(100, t('validation.maxLength')),
  phone_numbers: z.preprocess(
    (val) => (val === undefined || val === null ? [] : val),
    z
      .array(
        z
          .string()
          .min(1, t('validation.phoneNumbers.required'))
          .regex(/^\+?[0-9]{1,13}$/,
            t('validation.phoneNumbers.invalid')
          )
      )
      .min(1, t('validation.phoneNumbers.required'))
  ),
  email: z.string().email(t('validation.email')).optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'approved', 'rejected', 'expired']).default('draft'),
  media_ids: z.preprocess(
    (val) => (val === undefined || val === null ? [] : val),
    z.array(z.number()).min(1, t('validation.media.required'))
  ),
});
