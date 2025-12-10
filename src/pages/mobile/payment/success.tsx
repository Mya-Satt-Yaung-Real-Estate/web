/**
 * Mobile Payment Success Page
 * 
 * Standalone mobile page for payment success (no header, no footer).
 * Used in mobile app (Flutter WebView) context.
 */

import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { pointKeys } from '@/services/queries/points';

export function PaymentSuccessMobile() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const merchantOrderId = searchParams.get('merchantOrderId');

  useEffect(() => {
    // Prevent body scrolling and pinch zoom when in mobile WebView
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.touchAction = 'pan-y';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100vh';

    // Refresh point data when page loads
    queryClient.invalidateQueries({ queryKey: pointKeys.packages() });
    queryClient.invalidateQueries({ queryKey: pointKeys.fifo() });
    queryClient.invalidateQueries({ queryKey: pointKeys.transactions() });

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    };
  }, [queryClient]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="w-full px-6 py-8">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {t('payments.paymentSuccess') || 'Payment Successful'}
            </h1>
            <p className="text-gray-600 text-sm">
              {t('payments.paymentReturnSuccess') || 'Payment completed successfully! Points have been added to your account.'}
            </p>
          </div>

          {/* Order ID (if available) */}
          {merchantOrderId && (
            <div className="w-full bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Order ID</p>
              <p className="text-sm font-mono text-gray-900 break-all">{merchantOrderId}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
