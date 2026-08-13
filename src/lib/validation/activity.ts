import { z } from 'zod';

export const activityFormSchema = (t: (key: string) => string) =>
  z.object({
    title: z
      .string()
      .min(1, t('validation.title.required'))
      .max(255, t('myActivities.titleMax') || 'Title must be 255 characters or less'),
    description: z
      .string()
      .trim()
      .min(1, t('validation.description.required'))
      .max(5000, t('myActivities.descriptionMax') || 'Description must be 5000 characters or less'),
    status: z.enum(['draft', 'published']),
    media_ids: z.array(z.number()).min(1, t('validation.media.required') || 'Please upload at least one photo.'),
  });

export type ActivityFormValues = z.infer<ReturnType<typeof activityFormSchema>>;
