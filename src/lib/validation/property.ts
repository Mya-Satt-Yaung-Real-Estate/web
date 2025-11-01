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
  property_condition: z.any()
    .refine((val) => {
      // Check if value is empty
      if (val === '' || val === null || val === undefined) {
        return false;
      }
      return true;
    }, {
      message: t('validation.propertyCondition.required')
    })
    .refine((val) => {
      // Check if value is valid enum
      return val === 'ready' || val === 'some' || val === 'no';
    }, {
      message: t('validation.propertyCondition.required')
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
  length: z.preprocess((v) => {
    if (v === '' || v === undefined || v === null) return undefined;
    return v;
  }, z.union([
    z.string().refine((val) => {
      // If empty string, treat as undefined (valid for optional field)
      if (val === '') return true;
      const num = Number(val);
      // If valid number and positive, it's valid
      return !isNaN(num) && num > 0;
    }, {
      message: t('validation.length.invalid')
    }),
    z.number().positive(t('validation.length.invalid')),
    z.undefined()
  ]).transform((val) => {
    if (val === '' || val === undefined || val === null) return undefined;
    if (typeof val === 'string') {
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    }
    return val;
  }).optional()),
  width: z.preprocess((v) => {
    if (v === '' || v === undefined || v === null) return undefined;
    return v;
  }, z.union([
    z.string().refine((val) => {
      // If empty string, treat as undefined (valid for optional field)
      if (val === '') return true;
      const num = Number(val);
      // If valid number and positive, it's valid
      return !isNaN(num) && num > 0;
    }, {
      message: t('validation.width.invalid')
    }),
    z.number().positive(t('validation.width.invalid')),
    z.undefined()
  ]).transform((val) => {
    if (val === '' || val === undefined || val === null) return undefined;
    if (typeof val === 'string') {
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    }
    return val;
  }).optional()),
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
  email: z.preprocess(
    (v) => (v === '' || v === undefined || v === null ? undefined : v),
    z.string().email(t('validation.email.invalid')).optional()
  ),
  status: z.enum(['draft', 'published']).default('published'),
  tan_tan_tan: z.boolean().default(false),
  is_trending: z.boolean().default(false),
  bank_installment_available: z.boolean().default(false),
  media_ids: z.preprocess(
    (val) => (val === undefined || val === null ? [] : val),
    z.array(z.number()).min(1, t('validation.media.required'))
  ),
});



