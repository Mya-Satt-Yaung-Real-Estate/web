import { z } from 'zod';

/**
 * Validation schemas for form validation
 * Uses field-specific error messages for better UX
 */

export const createWantingListSchema = (t: (key: string) => string) => z.object({
  wanted_type: z.any()
    .refine((val) => {
      // First check if value is empty
      if (val === '' || val === null || val === undefined) {
        return false;
      }
      return true;
    }, {
      message: t('validation.wantedType.required')
    })
    .refine((val) => {
      // Then check if value is valid enum
      return val === 'buyer' || val === 'renter';
    }, {
      message: t('validation.wantedType.invalid')
    }),
  
  property_type_id: z.any().refine((val) => {
    if (val === '' || val === null || val === undefined) {
      return false;
    }
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, {
    message: t('validation.propertyType.required')
  }).transform((val) => Number(val)),
  
  title: z.string()
    .min(1, t('validation.title.required'))
    .min(10, t('validation.title.minLength')),
  
  prefer_region_id: z.any().refine((val) => {
    if (val === '' || val === null || val === undefined) {
      return false;
    }
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, {
    message: t('validation.region.required')
  }).transform((val) => Number(val)),
  
  prefer_township_id: z.any().refine((val) => {
    if (val === '' || val === null || val === undefined) {
      return false;
    }
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, {
    message: t('validation.township.required')
  }).transform((val) => Number(val)),
  
  name: z.string()
    .min(1, t('validation.name.required'))
    .min(2, t('validation.name.minLength')),
  
  phone: z.string()
    .min(1, t('validation.phone.required'))
    .regex(/^[0-9]{9,11}$/, t('validation.phone.invalid')),
  
  description: z.string().optional(),
  
  email: z.string()
    .email(t('validation.email.invalid'))
    .optional()
    .or(z.literal('')),
  
  min_budget: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number()
      .positive(t('validation.budget.positive'))
      .optional()
  ),
  
  max_budget: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number()
      .positive(t('validation.budget.positive'))
      .optional()
  ),
  
  bedrooms: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number()
      .int(t('validation.bedrooms.integer'))
      .min(0, t('validation.bedrooms.positive'))
      .optional()
  ),
  
  bathrooms: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number()
      .int(t('validation.bathrooms.integer'))
      .min(0, t('validation.bathrooms.positive'))
      .optional()
  ),
  
  min_area: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number()
      .positive(t('validation.area.positive'))
      .optional()
  ),
  
  max_area: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number()
      .positive(t('validation.area.positive'))
      .optional()
  ),
  
  additional_requirement: z.string().optional(),
  
  status: z.enum(['draft', 'published']).optional()
}).refine(
  (data) => !data.min_budget || !data.max_budget || data.min_budget <= data.max_budget,
  {
    message: t('validation.budget.range'),
    path: ['max_budget']
  }
).refine(
  (data) => !data.min_area || !data.max_area || data.min_area <= data.max_area,
  {
    message: t('validation.area.range'),
    path: ['max_area']
  }
);

export type WantingListFormData = z.infer<ReturnType<typeof createWantingListSchema>>;
