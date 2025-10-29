import { Label } from '@/components/ui/label';
import type { ReactNode } from 'react';

interface FormFieldProps {
  name: string;
  label: string;
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
      <Label htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};
