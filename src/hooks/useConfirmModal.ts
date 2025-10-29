import { useState, useCallback } from 'react';

export interface ConfirmModalOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onConfirm: () => void | Promise<void>;
}

export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmModalOptions | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const showConfirm = useCallback((opts: ConfirmModalOptions) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const hideConfirm = useCallback(() => {
    setIsOpen(false);
    setIsLoading(false);
    // Delay clearing options to allow animation to complete
    setTimeout(() => {
      setOptions(null);
    }, 300);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!options) return;
    
    try {
      setIsLoading(true);
      await options.onConfirm();
      hideConfirm();
    } catch (error) {
      console.error('Confirm action failed:', error);
      setIsLoading(false);
      // Don't hide modal on error, let user retry
    }
  }, [options, hideConfirm]);

  return {
    isOpen,
    options,
    isLoading,
    showConfirm,
    hideConfirm,
    handleConfirm,
  };
};
