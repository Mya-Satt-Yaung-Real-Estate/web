import { Label } from '@/components/ui/label';
import type { ReactNode } from 'react';

interface FormFieldProps {
  name: string;
  /** Omit when the section CardTitle already names the field. */
  label?: string;
  error?: { message?: string };
  children: ReactNode;
  required?: boolean;
  className?: string;
}

/**
 * Form field wrapper component that displays field label and error messages
 * Maintains the same UI/UX as the existing form fields
 */
export const FormField = ({ 
  name, 
  label, 
  error, 
  children, 
  required = false,
  className = "space-y-2"
}: FormFieldProps) => {
  return (
    <div className={className}>
      {label ? (
        <Label htmlFor={name} className="font-normal">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      ) : null}
      {children}
      {error && (
        <p className="text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};
