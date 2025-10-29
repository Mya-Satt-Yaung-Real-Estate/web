import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ZodSchema } from 'zod';

/**
 * Custom hook for form validation using React Hook Form and Zod
 * Integrates with existing i18n system for field-specific error messages
 */
export const useFormValidation = <T>(
  schemaFactory: (t: (key: string) => string) => ZodSchema<T>
) => {
  const { t, language } = useLanguage();
  
  // Recreate schema when language changes
  const schema = useMemo(() => schemaFactory(t), [t, language]);
  
  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onBlur', // Validate on blur for better UX
    reValidateMode: 'onChange', // Re-validate on change after first error
    defaultValues: {
      bedrooms: undefined,
      bathrooms: undefined,
      min_budget: undefined,
      max_budget: undefined,
      min_area: undefined,
      max_area: undefined,
      email: '',
      description: '',
      additional_requirement: ''
    } as Partial<T>
  });
  
  // Transform errors to use translated messages
  const translatedErrors = useMemo(() => {
    const errors = form.formState.errors;
    const transformedErrors: any = {};
    
    Object.keys(errors).forEach((key) => {
      const error = (errors as any)[key];
      if (error?.message) {
        // Keep the error but ensure it has the right structure
        transformedErrors[key] = error;
      }
    });
    
    return transformedErrors;
  }, [form.formState.errors, language]);
  
  return {
    form,
    errors: translatedErrors,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting,
    isDirty: form.formState.isDirty
  };
};
