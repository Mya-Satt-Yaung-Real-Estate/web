/**
 * Payment Modal Component
 * 
 * Multi-step payment modal for payment-integrated point purchases
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Package, Star, Loader2, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { paymentApi } from '@/services/api/payments';
import { pointKeys } from '@/services/queries/points';
import { useQueryClient } from '@tanstack/react-query';
import { useModal } from '@/contexts/ModalContext';
import type { PointPackage } from '@/types/points';
import type { PaymentProvider, PaymentMethod } from '@/types/payments';
import { PaymentProviderSelect } from './PaymentProviderSelect';
import { PaymentMethodSelect } from './PaymentMethodSelect';
import { QRCodeDisplay } from './QRCodeDisplay';
import { usePaymentStatusPolling } from './PaymentStatusPolling';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: PointPackage | null;
}

type PaymentStep = 'select' | 'processing' | 'payment' | 'success' | 'error';

export function PaymentModal({
  isOpen,
  onClose,
  package: pkg,
}: PaymentModalProps) {
  const { t, language } = useLanguage();
  const { showSuccess, showError } = useModal();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<PaymentStep>('select');
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('select');
      setSelectedProvider(null);
      setSelectedMethod(null);
      setPaymentData(null);
      setOrderId(null);
    }
  }, [isOpen]);

  // Payment token mutation
  const paymentTokenMutation = useMutation({
    mutationFn: (payload: { providerName: string; methodName: string; packageId: number }) => {
      return paymentApi.getPaymentToken(payload);
    },
    onSuccess: (response) => {
      // API response structure: { data: { status, message, response: { code, message, time, response: { amount, merchOrderId, ... } } } }
      // The API client wraps it: { data: <actual response>, success: true, ... }
      // So: response.data = { status: "success", response: { response: { amount, merchOrderId, ... } } }
      if (response.data?.status === 'success' && response.data?.response?.response) {
        const data = response.data.response.response;
        setPaymentData(data);
        setOrderId(data.merchOrderId);
        setStep('payment');
      } else {
        console.error('Invalid response structure:', response);
        setStep('error');
      }
    },
    onError: (error: any) => {
      console.error('Payment token error:', error);
      console.error('Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });
      setStep('error');
    },
  });

  // Payment status polling
  const {
    paymentStatus,
    isCompleted,
    isFailed,
    isTimeout,
    isLoading: isPolling,
  } = usePaymentStatusPolling({
    orderId,
    enabled: step === 'payment' && !!orderId,
    onSuccess: (status) => {
      if (status === 'completed') {
        setStep('success');
        // Refresh point data
        queryClient.invalidateQueries({ queryKey: pointKeys.packages() });
        queryClient.invalidateQueries({ queryKey: pointKeys.fifo() });
        // Show success message
        setTimeout(() => {
          showSuccess(
            t('payments.paymentSuccessDesc') || 'Points have been added to your account.',
            t('payments.paymentSuccess') || 'Payment Successful'
          );
        }, 500);
      }
    },
    onError: (error) => {
      console.error('Payment polling error:', error);
    },
  });

  const handleContinue = () => {
    if (!pkg || !selectedProvider || !selectedMethod) return;

    setStep('processing');
    paymentTokenMutation.mutate({
      providerName: selectedProvider,
      methodName: selectedMethod,
      packageId: pkg.id,
    });
  };

  const handleCancel = () => {
    if (step === 'payment' && orderId) {
      // Optionally cancel the order on backend
      // For now, just close the modal
    }
    onClose();
  };

  const getPackageName = () => {
    if (!pkg) return '';
    return language === 'mm' ? pkg.name_mm : pkg.name_en;
  };

  if (!pkg) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto" size="2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            {step === 'select' && (t('payments.selectPaymentMethod') || 'Select Payment Method')}
            {step === 'processing' && (t('payments.processing') || 'Processing...')}
            {step === 'payment' && (t('payments.completePayment') || 'Complete Payment')}
            {step === 'success' && (t('payments.paymentSuccess') || 'Payment Successful')}
            {step === 'error' && (t('payments.paymentError') || 'Payment Error')}
          </DialogTitle>
          <DialogDescription>
            {step === 'select' && (t('payments.selectPaymentMethodDesc') || 'Choose your payment provider and method')}
            {step === 'processing' && (t('payments.processingDesc') || 'Please wait while we process your payment...')}
            {step === 'payment' && (t('payments.completePaymentDesc') || 'Complete your payment using the QR code or instructions below')}
            {step === 'success' && (t('payments.paymentSuccessDesc') || 'Your payment was successful and points have been added to your account')}
            {step === 'error' && (t('payments.paymentErrorDesc') || 'An error occurred during payment processing')}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Package Summary - Always visible */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3 mb-6">
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground min-w-[140px]">
                {t('points.packages.package') || 'Package'}
              </span>
              <span className="text-sm text-muted-foreground mr-2">:</span>
              <span className="font-semibold">{getPackageName()}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground min-w-[140px]">
                {t('points.balance.points') || 'Points'}
              </span>
              <span className="text-sm text-muted-foreground mr-2">:</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{pkg.points.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground min-w-[140px]">
                {t('points.packages.price') || 'One-time Payment'}
              </span>
              <span className="text-sm text-muted-foreground mr-2">:</span>
              <span className="font-semibold text-primary">{pkg.formatted_price}</span>
            </div>
          </div>

          {/* Step Content */}
          {step === 'select' && (
            <div className="space-y-6">
              <PaymentProviderSelect
                selectedProvider={selectedProvider}
                onSelectProvider={setSelectedProvider}
              />
              <PaymentMethodSelect
                provider={selectedProvider}
                selectedMethod={selectedMethod}
                onSelectMethod={setSelectedMethod}
              />
            </div>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">
                {t('payments.processingPayment') || 'Processing your payment request...'}
              </p>
            </div>
          )}

          {step === 'payment' && paymentData && (
            <div className="space-y-4">
              {selectedMethod === 'QR' && paymentData.qrCode && (
                <QRCodeDisplay
                  qrCode={paymentData.qrCode}
                  amount={paymentData.amount}
                  orderId={paymentData.merchOrderId}
                  transactionNum={paymentData.transactionNum}
                  providerName={selectedProvider || ''}
                />
              )}

              {selectedMethod !== 'QR' && (
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="space-y-2">
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        {t('payments.pinInstructions') || 'Payment Instructions'}
                      </p>
                      <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                        <li>
                          {t('payments.pinInstruction1', { provider: selectedProvider }) ||
                            `Open your ${selectedProvider} app`}
                        </li>
                        <li>
                          {t('payments.pinInstruction2') || 'Enter the payment amount and complete the transaction'}
                        </li>
                        <li>
                          {t('payments.pinInstruction3') || 'Wait for payment confirmation'}
                        </li>
                      </ol>
                      <div className="mt-4 p-3 bg-white dark:bg-gray-900 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            {t('payments.amount') || 'Amount'}
                          </span>
                          <span className="font-semibold text-primary">
                            {paymentData.amount.toLocaleString()} MMK
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {t('payments.orderId') || 'Order ID'}
                          </span>
                          <span className="font-mono text-sm">{paymentData.merchOrderId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Status */}
              {isPolling && (
                <div className="flex items-center justify-center gap-2 p-4 bg-muted/50 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {t('payments.waitingForPayment') || 'Waiting for payment confirmation...'}
                  </span>
                </div>
              )}

              {isTimeout && (
                <div className="flex items-center gap-2 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    {t('payments.paymentTimeout') || 'Payment is taking longer than expected. Please check your payment app or contact support.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t('payments.paymentSuccess') || 'Payment Successful!'}
              </h3>
              <p className="text-muted-foreground text-center">
                {t('payments.pointsAdded') || 'Your points have been added to your account.'}
              </p>
            </div>
          )}

          {step === 'error' && (
            <div className="flex flex-col items-center justify-center py-12">
              <X className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t('payments.paymentError') || 'Payment Error'}
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                {paymentTokenMutation.error
                  ? (paymentTokenMutation.error as any)?.response?.data?.message ||
                    t('payments.paymentErrorDesc') ||
                    'An error occurred during payment processing'
                  : t('payments.paymentErrorDesc') || 'An error occurred during payment processing'}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setStep('select');
                  setSelectedProvider(null);
                  setSelectedMethod(null);
                }}
              >
                {t('payments.tryAgain') || 'Try Again'}
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          {step === 'select' && (
            <>
              <Button variant="outline" onClick={handleCancel}>
                {t('forms.cancel') || 'Cancel'}
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!selectedProvider || !selectedMethod}
              >
                {t('payments.continue') || 'Continue'}
              </Button>
            </>
          )}

          {step === 'processing' && (
            <Button variant="outline" onClick={handleCancel} disabled>
              {t('forms.cancel') || 'Cancel'}
            </Button>
          )}

          {step === 'payment' && (
            <Button variant="outline" onClick={handleCancel}>
              {t('payments.cancelPayment') || 'Cancel Payment'}
            </Button>
          )}

          {step === 'success' && (
            <Button onClick={handleCancel}>
              {t('payments.close') || 'Close'}
            </Button>
          )}

          {step === 'error' && (
            <Button variant="outline" onClick={handleCancel}>
              {t('payments.close') || 'Close'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

