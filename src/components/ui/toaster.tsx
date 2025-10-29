import { Toaster as Sonner } from 'sonner';

/**
 * Toast notification component using Sonner
 * Provides reusable toast notifications throughout the app
 */
export const Toaster = () => {
  return (
    <Sonner
      position="top-right"
      richColors
      closeButton
    />
  );
};
