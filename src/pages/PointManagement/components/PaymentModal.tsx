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
import { useAuthStore } from '@/stores/authStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PointPackage } from '@/types/points';
import type { PaymentProvider, PaymentMethod } from '@/types/payments';
import { PaymentProviderSelect } from './PaymentProviderSelect';
import { PaymentMethodSelect } from './PaymentMethodSelect';
import { QRCodeDisplay } from './QRCodeDisplay';
import { usePaymentStatusPolling } from './PaymentStatusPolling';
import { validateMyanmarPhone } from '@/utils/phoneValidation';
import { CheckCircle2 as CheckCircle2Icon, XCircle } from 'lucide-react';
import { requiresRedirect, buildRedirectUrl, redirectToPaymentGateway } from '@/utils/paymentRedirect';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: PointPackage | null;
  onPaymentSuccess?: () => void;
}

type PaymentStep = 'select' | 'processing' | 'payment' | 'success' | 'error';

export function PaymentModal({
  isOpen,
  onClose,
  package: pkg,
  onPaymentSuccess,
}: PaymentModalProps) {
  const { t, language } = useLanguage();
  const { showSuccess } = useModal();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [step, setStep] = useState<PaymentStep>('select');
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [phoneValidation, setPhoneValidation] = useState<{ isValid: boolean; error?: string }>({ isValid: false });
  const [paymentData, setPaymentData] = useState<any>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Provider methods mapping (same as PaymentMethodSelect)
  const PROVIDER_METHODS: Record<PaymentProvider, PaymentMethod[]> = {
    'AYA Pay': ['QR', 'PIN'],
    'KBZ Pay': ['QR'],
    'Wave Pay': ['PIN'],
    'OK$': ['PIN'],
    'Sai Sai Pay': ['PIN'],
    'Onepay': ['PIN'],
    'MPitesan': ['PIN'],
    'MPT Pay': ['PIN'],
    'CB Pay': ['QR'],
    'UAB Pay': ['PIN'],
  };

  // Handle provider change - clear method if it's not valid for new provider
  const handleProviderChange = (provider: PaymentProvider) => {
    setSelectedProvider(provider);
    const availableMethods = PROVIDER_METHODS[provider] || [];
    // Clear selected method if it's not available for the new provider
    if (selectedMethod && !availableMethods.includes(selectedMethod)) {
      setSelectedMethod(null);
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('select');
      setSelectedProvider(null);
      setSelectedMethod(null);
      setPaymentData(null);
      setOrderId(null);
      setCustomerName('');
      setCustomerPhone('');
      setPhoneValidation({ isValid: false });
    }
  }, [isOpen]);

  // Pre-fill customer name and phone from user profile for QR method
  // For PIN/OTP methods, user will enter manually
  useEffect(() => {
    if (isOpen && user) {
      if (selectedMethod === 'QR') {
        // Auto-fill from user profile for QR method
        if (user.name) {
          setCustomerName(user.name);
        }
        if (user.phone) {
          setCustomerPhone(user.phone);
          // Validate user's phone for QR method
          const validation = validateMyanmarPhone(user.phone);
          setPhoneValidation({ isValid: validation.isValid, error: validation.error });
        }
      } else if (selectedMethod === 'PIN' || selectedMethod === 'PWA') {
        // Clear fields when switching to PIN/PWA (user must enter manually)
        setCustomerName('');
        setCustomerPhone('');
        setPhoneValidation({ isValid: false });
      } else if (!selectedMethod) {
        // Clear fields when no method is selected
        setCustomerName('');
        setCustomerPhone('');
        setPhoneValidation({ isValid: false });
      }
    }
  }, [isOpen, user, selectedMethod]);

  // Handle phone input change with real-time validation
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomerPhone(value);
    
    // Only validate if method is PIN/PWA (not QR)
    if (selectedMethod === 'PIN' || selectedMethod === 'PWA') {
      if (value.trim()) {
        const validation = validateMyanmarPhone(value);
        setPhoneValidation({ isValid: validation.isValid, error: validation.error });
      } else {
        setPhoneValidation({ isValid: false, error: 'required' });
      }
    }
  };

  // Payment token mutation
  const paymentTokenMutation = useMutation({
    mutationFn: (payload: { providerName: string; methodName: string; packageId: number; customerName?: string; customerPhone?: string }) => {
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
        
        // Check if redirect is needed
        if (selectedProvider && selectedMethod && requiresRedirect(selectedProvider, selectedMethod)) {
          // If formToken exists, redirect to payment gateway
          if (data.formToken && data.transactionNum && data.merchOrderId) {
            const redirectUrl = buildRedirectUrl(
              selectedProvider,
              selectedMethod,
              data.formToken,
              data.transactionNum,
              data.merchOrderId
            );
            
            if (redirectUrl) {
              // Store order ID for status checking when user returns
              setOrderId(data.merchOrderId);
              setPaymentData(data);
              
              // Close modal before redirecting
              onClose();
              
              // Small delay to ensure modal closes smoothly, then redirect
              setTimeout(() => {
                const success = redirectToPaymentGateway(redirectUrl);
                if (!success) {
                  // If redirect failed, show error (though this is unlikely)
                  console.error('Failed to redirect to payment gateway');
                }
              }, 100);
            } else {
              // formToken exists but couldn't build URL (shouldn't happen)
              console.error('Failed to build redirect URL');
              setStep('error');
            }
          } else {
            // Redirect needed but formToken missing
            console.error('Redirect required but formToken is missing');
            setStep('error');
          }
        } else {
          // No redirect needed, proceed to payment step (show QR code or PIN instructions)
          setStep('payment');
        }
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
    isTimeout,
    isLoading: isPolling,
  } = usePaymentStatusPolling({
    orderId,
    enabled: step === 'payment' && !!orderId,
    onSuccess: (status) => {
      if (status === 'SUCCESS') {
        // Notify parent component that payment succeeded FIRST (before any other operations)
        onPaymentSuccess?.();
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
    
    // For QR method, use authenticated user's name and phone
    // For PIN/OTP methods, require user to enter manually
    let finalCustomerName = '';
    let finalCustomerPhone = '';
    
    if (selectedMethod === 'QR') {
      // Use authenticated user's info for QR
      finalCustomerName = user?.name || '';
      finalCustomerPhone = user?.phone || '';
      
      // Validate user's phone for QR method
      if (finalCustomerPhone) {
        const validation = validateMyanmarPhone(finalCustomerPhone);
        if (!validation.isValid) {
          // Show error if user's phone is invalid
          return;
        }
        finalCustomerPhone = validation.normalized;
      }
    } else {
      // For PIN/OTP, require manual entry and validation
      if (!customerName.trim()) return;
      
      // Validate phone number
      if (!customerPhone.trim()) {
        setPhoneValidation({ isValid: false, error: 'required' });
        return;
      }
      
      const validation = validateMyanmarPhone(customerPhone);
      if (!validation.isValid) {
        setPhoneValidation({ isValid: false, error: validation.error });
        return;
      }
      
      finalCustomerName = customerName.trim();
      finalCustomerPhone = validation.normalized; // Use normalized phone
    }

    setStep('processing');
    paymentTokenMutation.mutate({
      providerName: selectedProvider,
      methodName: selectedMethod,
      packageId: pkg.id,
      customerName: finalCustomerName,
      customerPhone: finalCustomerPhone,
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
                onSelectProvider={handleProviderChange}
              />
              <PaymentMethodSelect
                provider={selectedProvider}
                selectedMethod={selectedMethod}
                onSelectMethod={setSelectedMethod}
              />
              
              {/* Customer Information - Only show for PIN/PWA methods when method is selected */}
              {selectedProvider && selectedMethod && selectedMethod !== 'QR' && selectedMethod !== null && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">
                      {t('payments.customerName') || 'Customer Name'}
                    </Label>
                    <Input
                      id="customerName"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={t('payments.customerNamePlaceholder') || 'Enter your name'}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">
                      {t('payments.customerPhone') || 'Phone Number'}
                    </Label>
                    <div className="relative">
                      <Input
                        id="customerPhone"
                        type="tel"
                        value={customerPhone}
                        onChange={handlePhoneChange}
                        placeholder={t('payments.customerPhonePlaceholder') || 'Enter your phone number (09XXXXXXXXX)'}
                        required
                        className={`pr-10 ${
                          customerPhone && phoneValidation.isValid
                            ? 'border-green-500 focus-visible:ring-green-500'
                            : customerPhone && !phoneValidation.isValid
                            ? 'border-red-500 focus-visible:ring-red-500'
                            : ''
                        }`}
                      />
                      {customerPhone && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {phoneValidation.isValid ? (
                            <CheckCircle2Icon className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {customerPhone && !phoneValidation.isValid && phoneValidation.error && (
                      <p className="text-sm text-red-500">
                        {phoneValidation.error === 'required' &&
                          (t('payments.customerPhoneRequired') || 'Phone number is required')}
                        {phoneValidation.error === 'mustStartWith09' &&
                          (t('payments.customerPhoneMustStartWith09') || 'Phone number must start with 09')}
                        {phoneValidation.error === 'tooShort' &&
                          (t('payments.customerPhoneMustBe11Digits') || 'Phone number must be 11 digits')}
                        {phoneValidation.error === 'tooLong' &&
                          (t('payments.customerPhoneMustBe11Digits') || 'Phone number must be 11 digits')}
                        {phoneValidation.error === 'onlyNumbers' &&
                          (t('payments.customerPhoneOnlyNumbers') || 'Phone number must contain only numbers')}
                        {!['required', 'mustStartWith09', 'tooShort', 'tooLong', 'onlyNumbers'].includes(phoneValidation.error) &&
                          (t('payments.customerPhoneInvalid') || 'Please enter a valid Myanmar phone number (09XXXXXXXXX)')}
                      </p>
                    )}
                  </div>
                </div>
              )}
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
              {/* Show QR code if QR code exists */}
              {selectedMethod === 'QR' && paymentData.qrCode && (
                <QRCodeDisplay
                  qrCode={paymentData.qrCode}
                  amount={paymentData.amount}
                  orderId={paymentData.merchOrderId}
                  transactionNum={paymentData.transactionNum}
                  providerName={selectedProvider || ''}
                />
              )}

              {/* Show PIN instructions if method is PIN/PWA */}
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
                          {t('payments.pinInstruction1', { provider: selectedProvider || '' }) ||
                            `Open your ${selectedProvider || ''} app`}
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
                  disabled={
                    !selectedProvider || 
                    !selectedMethod || 
                    (selectedMethod !== 'QR' && (!customerName.trim() || !customerPhone.trim() || !phoneValidation.isValid)) ||
                    (selectedMethod === 'QR' && (!user?.name || !user?.phone || !phoneValidation.isValid))
                  }
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

