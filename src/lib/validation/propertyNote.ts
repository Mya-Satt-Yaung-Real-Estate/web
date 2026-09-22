import { z } from 'zod';

/**
 * Website Property Note create/edit validation.
 */
export const createPropertyNoteSchema = (t: (key: string) => string) =>
  z.object({
    listing_type_id: z
      .any()
      .refine((val) => {
        if (val === '' || val === null || val === undefined) return false;
        const num = Number(val);
        return !Number.isNaN(num) && num > 0;
      }, { message: t('validation.listingType.required') || 'Listing type is required' })
      .transform((val) => Number(val)),

    region_id: z
      .any()
      .refine((val) => {
        if (val === '' || val === null || val === undefined) return false;
        const num = Number(val);
        return !Number.isNaN(num) && num > 0;
      }, { message: t('validation.region.required') || 'Region is required' })
      .transform((val) => Number(val)),

    township_id: z
      .any()
      .refine((val) => {
        if (val === '' || val === null || val === undefined) return false;
        const num = Number(val);
        return !Number.isNaN(num) && num > 0;
      }, { message: t('validation.township.required') || 'Township is required' })
      .transform((val) => Number(val)),

    ward: z.string().max(255).optional().nullable(),
    road: z.string().max(255).optional().nullable(),

    length_ft: z
      .any()
      .optional()
      .nullable()
      .transform((val) => {
        if (val === '' || val === null || val === undefined) return null;
        const num = Number(val);
        return Number.isNaN(num) ? null : num;
      }),

    width_ft: z
      .any()
      .optional()
      .nullable()
      .transform((val) => {
        if (val === '' || val === null || val === undefined) return null;
        const num = Number(val);
        return Number.isNaN(num) ? null : num;
      }),

    latitude: z
      .any()
      .refine((val) => {
        const num = Number(val);
        return !Number.isNaN(num) && num >= -90 && num <= 90;
      }, { message: t('validation.latitude.required') || 'Map location is required' })
      .transform((val) => Number(val)),

    longitude: z
      .any()
      .refine((val) => {
        const num = Number(val);
        return !Number.isNaN(num) && num >= -180 && num <= 180;
      }, { message: t('validation.longitude.required') || 'Map location is required' })
      .transform((val) => Number(val)),

    media_ids: z
      .array(z.number())
      .min(1, t('validation.media.required') || 'At least one photo is required'),
  });

export type PropertyNoteFormData = z.infer<ReturnType<typeof createPropertyNoteSchema>>;
