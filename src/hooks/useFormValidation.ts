import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ZodSchema } from 'zod';
import type { FieldValues } from 'react-hook-form';

/**
 * Custom hook for form validation using React Hook Form and Zod
 * Integrates with existing i18n system for field-specific error messages
 */
export const useFormValidation = <T extends FieldValues>(
  schemaFactory: (t: (key: string) => string) => ZodSchema<T>
) => {
  const { t, language } = useLanguage();

  // Recreate schema when language changes
  const schema = useMemo(() => schemaFactory(t), [t, language]);

  const form = useForm<T>({
    resolver: zodResolver(schema as any) as any,
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      bedrooms: undefined,
      bathrooms: undefined,
      min_budget: undefined,
      max_budget: undefined,
      min_area: undefined,
      max_area: undefined,
      email: '',
      description: '',
      address: '',
    } as any,
  });

  /**
   * Must read formState during render so RHF Proxy subscribes this component.
   * Do NOT memoize on `errors` alone — it is a stable Proxy reference, so
   * useMemo would keep stale messages after clearErrors / successful revalidate.
   */
  const { errors: formErrors, isValid, isSubmitting, isDirty } = form.formState;
  const errorSignature = Object.keys(formErrors)
    .map((key) => `${key}:${(formErrors as Record<string, { message?: string }>)[key]?.message ?? ''}`)
    .join('|');

  const translatedErrors = useMemo(() => {
    const transformedErrors: Record<string, { message?: string }> = {};

    Object.keys(formErrors).forEach((key) => {
      const error = (formErrors as Record<string, { message?: string } | undefined>)[key];
      if (error?.message) {
        transformedErrors[key] = error;
      }
    });

    return transformedErrors;
    // errorSignature changes when messages appear/clear; language for i18n schema swap
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorSignature, language]);

  return {
    form,
    errors: translatedErrors,
    isValid,
    isSubmitting,
    isDirty,
  };
};
