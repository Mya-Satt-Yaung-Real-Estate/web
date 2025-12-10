/**
 * Mobile Payment Fail Page
 * 
 * Standalone mobile page for payment failure (no header, no footer).
 * Used in mobile app (Flutter WebView) context.
 */

import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { XCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { pointKeys } from '@/services/queries/points';

export function PaymentFailMobile() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const merchantOrderId = searchParams.get('merchantOrderId');
  const state = searchParams.get('state')?.toUpperCase();

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

  // Determine message based on state
  const paymentStatus = useMemo(() => {
    switch (state) {
      case 'ERROR':
      case 'SYSTEM_ERROR':
        return {
          title: t('payments.paymentError') || 'Payment Error',
          message: t('payments.paymentReturnError') || 'Payment failed. Please try again or contact support if the issue persists.',
          icon: XCircle,
          bgColor: 'bg-red-100',
          iconColor: 'text-red-600',
        };
      case 'TIMEOUT':
        return {
          title: t('payments.paymentTimeout') || 'Payment Timeout',
          message: t('payments.paymentReturnTimeout') || 'Payment timeout. Please check your payment status or contact support if the payment was completed.',
          icon: AlertCircle,
          bgColor: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
        };
      case 'CANCELLED':
        return {
          title: t('payments.paymentCancelled') || 'Payment Cancelled',
          message: t('payments.paymentReturnCancelled') || 'Payment was cancelled. You can try again when ready.',
          icon: AlertCircle,
          bgColor: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
        };
      case 'DECLINED':
        return {
          title: t('payments.paymentDeclined') || 'Payment Declined',
          message: t('payments.paymentReturnDeclined') || 'Payment was declined. Please check your payment method and try again.',
          icon: XCircle,
          bgColor: 'bg-red-100',
          iconColor: 'text-red-600',
        };
      default:
        return {
          title: t('payments.paymentError') || 'Payment Error',
          message: t('payments.paymentReturnError') || 'Payment failed. Please try again or contact support if the issue persists.',
          icon: XCircle,
          bgColor: 'bg-red-100',
          iconColor: 'text-red-600',
        };
    }
  }, [state, t]);

  const { title, message, icon: Icon, bgColor, iconColor } = paymentStatus;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="w-full px-6 py-8">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Error Icon */}
          <div className={`w-20 h-20 rounded-full ${bgColor} flex items-center justify-center`}>
            <Icon className={`w-12 h-12 ${iconColor}`} />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {title}
            </h1>
            <p className="text-gray-600 text-sm">
              {message}
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
