import { z } from 'zod';

export const createPropertySchema = (t: (key: string) => string) => z.object({
  property_type_id: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? 0 : val),
    z.coerce.number().min(1, t('validation.propertyType.required'))
  ),
  listing_type_id: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? 0 : val),
    z.coerce.number().min(1, t('validation.required'))
  ),
  property_condition: z.enum(['ready', 'some', 'no'], {
    errorMap: () => ({ message: t('validation.propertyCondition.required') })
  }),
  title_en: z.string().min(1, t('validation.titleEn.required')).max(255, t('validation.maxLength')),
  title_mm: z.string().min(1, t('validation.titleMm.required')).max(255, t('validation.maxLength')),
  description: z.string().min(1, t('validation.description.required')).max(2000, t('validation.maxLength')),
  region_id: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? 0 : val),
    z.coerce.number().min(1, t('validation.region.required'))
  ),
  township_id: z.preprocess(
    (val) => (val === '' || val === undefined || val === null ? 0 : val),
    z.coerce.number().min(1, t('validation.township.required'))
  ),
  address: z.string().min(1, t('validation.address.required')).max(500, t('validation.maxLength')),
  latitude: z.preprocess((v) => (v === '' || v === undefined ? undefined : v), z.coerce.number().optional()),
  longitude: z.preprocess((v) => (v === '' || v === undefined ? undefined : v), z.coerce.number().optional()),
  price: z.preprocess(
    (v) => (v === '' || v === undefined || v === null ? 0 : v),
    z.coerce.number().positive(t('validation.price.required'))
  ),
  length: z.preprocess((v) => (v === '' || v === undefined ? undefined : v), z.coerce.number().positive()).optional(),
  width: z.preprocess((v) => (v === '' || v === undefined ? undefined : v), z.coerce.number().positive()).optional(),
  area_sqft: z.preprocess(
    (v) => (v === '' || v === undefined || v === null ? 0 : v),
    z.coerce.number().positive(t('validation.area.required'))
  ),
  bedrooms: z.preprocess(
    (v) => (v === '' || v === undefined || v === null ? 0 : v),
    z.coerce.number().int().min(1, t('validation.bedrooms.required'))
  ),
  bathrooms: z.preprocess(
    (v) => (v === '' || v === undefined || v === null ? 0 : v),
    z.coerce.number().int().min(1, t('validation.bathrooms.required'))
  ),
  owner_name: z.string().min(1, t('validation.name.required')).max(100, t('validation.maxLength')),
  phone_numbers: z.preprocess(
    (val) => (val === undefined || val === null ? [] : val),
    z.array(
      z
        .string()
        .min(1, t('validation.phoneNumbers.required'))
        .regex(/^\+?[0-9]{1,13}$/, t('validation.phoneNumbers.invalid'))
    ).min(1, t('validation.phoneNumbers.required'))
  ),
  email: z.string().email(t('validation.email.invalid')).optional().or(z.literal('')),
  status: z.enum(['draft', 'published']).default('published'),
  tan_tan_tan: z.boolean().default(false),
  is_trending: z.boolean().default(false),
  bank_installment_available: z.boolean().default(false),
  media_ids: z.preprocess(
    (val) => (val === undefined || val === null ? [] : val),
    z.array(z.number()).min(1, t('validation.media.required'))
  ),
});



