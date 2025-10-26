import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  showCloseButton?: boolean;
  showOverlay?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children?: React.ReactNode;
}

const modalVariants = {
  success: {
    icon: CheckCircle,
    iconClassName: 'text-green-600',
    titleClassName: 'text-green-900',
    messageClassName: 'text-green-700',
    buttonClassName: 'bg-green-600 hover:bg-green-700 text-white',
  },
  error: {
    icon: AlertCircle,
    iconClassName: 'text-red-600',
    titleClassName: 'text-red-900',
    messageClassName: 'text-red-700',
    buttonClassName: 'bg-red-600 hover:bg-red-700 text-white',
  },
  warning: {
    icon: AlertTriangle,
    iconClassName: 'text-yellow-600',
    titleClassName: 'text-yellow-900',
    messageClassName: 'text-yellow-700',
    buttonClassName: 'bg-yellow-600 hover:bg-yellow-700 text-white',
  },
  info: {
    icon: Info,
    iconClassName: 'text-blue-600',
    titleClassName: 'text-blue-900',
    messageClassName: 'text-blue-700',
    buttonClassName: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
};

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  showCloseButton = true,
  showOverlay = true,
  size = 'md',
  children,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const variant = modalVariants[type];
  const Icon = variant.icon;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
    >
      {showOverlay && (
        <div 
          className="absolute inset-0 bg-black/50" 
          onClick={handleOverlayClick}
        />
      )}
      
      <div
        className={cn(
          'relative bg-white rounded-xl shadow-2xl transform transition-all duration-300 w-full',
          sizeClasses[size],
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Icon className={cn('h-6 w-6', variant.iconClassName)} />
            <h3 className={cn('text-lg font-semibold', variant.titleClassName)}>
              {title || (type === 'success' ? 'Success' : type === 'error' ? 'Error' : type === 'warning' ? 'Warning' : 'Information')}
            </h3>
          </div>
          
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <p className={cn('text-base leading-relaxed', variant.messageClassName)}>
            {message}
          </p>
          
          {children && (
            <div className="mt-4">
              {children}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className={cn(
              'px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-md',
              variant.buttonClassName
            )}
          >
            {type === 'success' ? 'Great!' : type === 'error' ? 'Try Again' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
