import React, { createContext, useContext, useCallback, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import type { ModalProps } from '@/components/ui/modal';

interface ModalContextType {
  showModal: (modal: Omit<ModalProps, 'isOpen' | 'onClose'>) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  hideModal: () => void;
  isModalOpen: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalProps, setModalProps] = useState<Omit<ModalProps, 'isOpen' | 'onClose'> | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const showModal = useCallback((modal: Omit<ModalProps, 'isOpen' | 'onClose'>) => {
    setModalProps(modal);
    setIsOpen(true);
  }, []);

  const showSuccess = useCallback((message: string, title?: string) => {
    showModal({
      type: 'success',
      title: title || 'Success!',
      message,
      size: 'md',
    });
  }, [showModal]);

  const showError = useCallback((message: string, title?: string) => {
    showModal({
      type: 'error',
      title: title || 'Error',
      message,
      size: 'md',
    });
  }, [showModal]);

  const showWarning = useCallback((message: string, title?: string) => {
    showModal({
      type: 'warning',
      title: title || 'Warning',
      message,
      size: 'md',
    });
  }, [showModal]);

  const showInfo = useCallback((message: string, title?: string) => {
    showModal({
      type: 'info',
      title: title || 'Information',
      message,
      size: 'md',
    });
  }, [showModal]);

  const hideModal = useCallback(() => {
    setIsOpen(false);
    // Delay clearing props to allow animation to complete
    setTimeout(() => {
      setModalProps(null);
    }, 300);
  }, []);

  const value: ModalContextType = {
    showModal,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideModal,
    isModalOpen: isOpen,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modalProps && (
        <Modal
          {...modalProps}
          isOpen={isOpen}
          onClose={hideModal}
        />
      )}
    </ModalContext.Provider>
  );
};
