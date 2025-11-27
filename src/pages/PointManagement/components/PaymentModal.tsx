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
import { Package, Star, Loader2, AlertCircle, CheckCircle2, X, Mail } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
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
import { requiresRedirect, buildRedirectUrl, redirectToPaymentGateway, openPaymentGatewayInNewTab, shouldUseNewTab } from '@/utils/paymentRedirect';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: PointPackage | null;
  onPaymentSuccess?: () => void;
}

type PaymentStep = 'select' | 'billingInfo' | 'processing' | 'payment' | 'success' | 'error';

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
  const [email, setEmail] = useState<string>('');
  const [billAddress, setBillAddress] = useState<string>('');
  const [billCity, setBillCity] = useState<string>('');
  const [emailValidation, setEmailValidation] = useState<{ isValid: boolean; error?: string }>({ isValid: false });
  const [paymentData, setPaymentData] = useState<any>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [redirectOpenedInNewTab, setRedirectOpenedInNewTab] = useState<boolean>(false);
  const newTabOpenedRef = useRef<boolean>(false);

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
    'Visa': ['OTP'], // Credit cards use OTP method
    'Master': ['OTP'], // Credit cards use OTP method
    'JCB': ['OTP'], // Credit cards use OTP method
  };

  // Check if provider is a credit card (doesn't need method selection)
  const isCreditCardProvider = (provider: PaymentProvider | null): boolean => {
    return provider === 'Visa' || provider === 'Master' || provider === 'JCB';
  };

  // Check if provider should show customer name/phone fields
  const shouldShowCustomerInfo = (provider: PaymentProvider | null, method: PaymentMethod | null): boolean => {
    if (!provider || !method) return false;
    
    // Show customer info for these providers:
    // - Sai Sai Pay (PIN)
    // - Onepay (PIN)
    // - MPitesan (PIN)
    // - AYA Pay (PIN only, not QR)
    // - UAB Pay (PIN)
    const providersWithCustomerInfo: PaymentProvider[] = ['Sai Sai Pay', 'Onepay', 'MPitesan', 'UAB Pay'];
    
    if (providersWithCustomerInfo.includes(provider) && method !== 'QR') {
      return true;
    }
    
    // AYA Pay - only show for PIN method
    if (provider === 'AYA Pay' && method === 'PIN') {
      return true;
    }
    
    return false;
  };

  // Handle provider change - auto-select method if provider has only one method
  const handleProviderChange = (provider: PaymentProvider) => {
    setSelectedProvider(provider);
    const availableMethods = PROVIDER_METHODS[provider] || [];
    
    // Auto-select method if provider has only one method
    if (availableMethods.length === 1) {
      setSelectedMethod(availableMethods[0]);
    } else if (availableMethods.length > 1) {
      // For providers with multiple methods (like AYA Pay), clear selection
      // User must select manually
      if (selectedMethod && !availableMethods.includes(selectedMethod)) {
        setSelectedMethod(null);
      }
    } else {
      // No methods available, clear selection
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
      setEmail('');
      setBillAddress('');
      setBillCity('');
      setEmailValidation({ isValid: false });
      setRedirectOpenedInNewTab(false);
      newTabOpenedRef.current = false;
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
      } else if (selectedMethod === 'PIN' || selectedMethod === 'PWA' || selectedMethod === 'OTP') {
        // Check if provider should show customer info fields
        if (selectedProvider && shouldShowCustomerInfo(selectedProvider, selectedMethod)) {
          // Providers that require customer info - clear fields (user must enter manually)
          setCustomerName('');
          setCustomerPhone('');
          setPhoneValidation({ isValid: false });
        } else {
          // Other providers - use authenticated user's info or empty (for redirect providers)
          setCustomerName(user?.name || '');
          setCustomerPhone(user?.phone || '');
          if (user?.phone) {
            const validation = validateMyanmarPhone(user.phone);
            setPhoneValidation({ isValid: validation.isValid, error: validation.error });
          } else {
            setPhoneValidation({ isValid: false });
          }
        }
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
    
    // Only validate if method is PIN/PWA/OTP (not QR)
    if (selectedMethod === 'PIN' || selectedMethod === 'PWA' || selectedMethod === 'OTP') {
      if (value.trim()) {
        const validation = validateMyanmarPhone(value);
        setPhoneValidation({ isValid: validation.isValid, error: validation.error });
      } else {
        setPhoneValidation({ isValid: false, error: 'required' });
      }
    }
  };

  // Handle email input change with real-time validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(value.trim())) {
        setEmailValidation({ isValid: true });
      } else {
        setEmailValidation({ isValid: false, error: 'invalid' });
      }
    } else {
      setEmailValidation({ isValid: false, error: 'required' });
    }
  };

  // Payment token mutation
  const paymentTokenMutation = useMutation({
    mutationFn: (payload: { providerName: string; methodName: string; packageId: number; customerName?: string; customerPhone?: string; email?: string; billAddress?: string; billCity?: string }) => {
      return paymentApi.getPaymentToken(payload);
    },
    onSuccess: (response) => {
      try {
        // Log full response for debugging
        console.log('Payment token response:', response);
        
        // API response structure: { data: { status, message, response: { code, message, time, response: { amount, merchOrderId, ... } } } }
        // The API client wraps it: { data: <actual response>, success: true, ... }
        // So: response.data = { status: "success", response: { response: { amount, merchOrderId, ... } } }
        
        // Validate response structure step by step
        if (!response || !response.data) {
          console.error('Invalid response: missing data', response);
          setStep('error');
          return;
        }

        const responseData = response.data;
        
        // Check if status is success
        if (responseData.status !== 'success') {
          console.error('Payment token request failed:', responseData.message || 'Unknown error');
          setStep('error');
          return;
        }

        // Validate nested response structure
        if (!responseData.response || !responseData.response.response) {
          console.error('Invalid response structure: missing nested response', responseData);
          setStep('error');
          return;
        }

        const data = responseData.response.response;
        
        // Validate required fields
        if (!data.merchOrderId) {
          console.error('Invalid response: missing merchOrderId', data);
          setStep('error');
          return;
        }

        // Store payment data and order ID
        setPaymentData(data);
        setOrderId(data.merchOrderId);
        
        // Check if redirect is needed
        // For credit cards, use 'OTP' as method, for others use selectedMethod
        const methodForRedirect = isCreditCardProvider(selectedProvider) ? 'OTP' : selectedMethod;
        if (selectedProvider && methodForRedirect && requiresRedirect(selectedProvider, methodForRedirect)) {
          // Validate redirect requirements
          if (!data.formToken || !data.transactionNum || !data.merchOrderId) {
            console.error('Redirect required but missing required fields:', {
              hasFormToken: !!data.formToken,
              hasTransactionNum: !!data.transactionNum,
              hasMerchOrderId: !!data.merchOrderId,
            });
            setStep('error');
            return;
          }

          // Build redirect URL
          const redirectUrl = buildRedirectUrl(
            selectedProvider,
            methodForRedirect,
            data.formToken,
            data.transactionNum,
            data.merchOrderId
          );
          
          if (!redirectUrl) {
            console.error('Failed to build redirect URL');
            setStep('error');
            return;
          }

          // Check if provider should use new tab or same-window redirect
          const useNewTab = selectedProvider && shouldUseNewTab(selectedProvider);
          
          if (useNewTab) {
            // Open in new tab (e.g., OK$)
            const newWindow = openPaymentGatewayInNewTab(redirectUrl);
            if (!newWindow) {
              // If popup blocked, show error
              console.error('Failed to open payment gateway in new tab. Popup may be blocked.');
              setStep('error');
              return;
            }
            // Successfully opened new tab - mark state and proceed to payment step
            newTabOpenedRef.current = true;
            setRedirectOpenedInNewTab(true);
            setStep('payment');
            // Don't set error state - new tab opened successfully
          } else {
            // Same-window redirect (default for other providers)
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
          }
        } else {
          // No redirect needed, proceed to payment step (show QR code or PIN instructions)
          // For QR methods, we need qrCode
          // For PIN methods, we just need transaction details (merchOrderId, transactionNum, amount)
          if (selectedMethod === 'QR' && !data.qrCode) {
            console.error('QR method requires qrCode but it is missing', data);
            setStep('error');
            return;
          }
          // For PIN methods, we have merchOrderId and transactionNum (already validated above), so we're good
          setStep('payment');
        }
      } catch (error) {
        // Catch any unexpected errors during response processing
        console.error('Unexpected error processing payment response:', error);
        setStep('error');
      }
    },
    onError: (error: any) => {
      // Only show error if new tab was NOT successfully opened
      // This prevents showing error after successful new tab open
      if (newTabOpenedRef.current) {
        console.warn('Error occurred but new tab already opened successfully, ignoring error:', error);
        return;
      }
      
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
    if (!pkg || !selectedProvider) return;
    
    // Credit cards need OTP method selection - then go to billing info step
    if (isCreditCardProvider(selectedProvider)) {
      // For credit cards, method must be OTP
      if (!selectedMethod || selectedMethod !== 'OTP') {
        return;
      }
      setStep('billingInfo');
      return;
    }
    
    // For other providers, method is required
    if (!selectedMethod) return;
    
    // For providers that show customer info fields, require manual entry
    // For QR method, use authenticated user's name and phone
    // For other providers, use authenticated user's info or empty
    let finalCustomerName = '';
    let finalCustomerPhone = '';
    
    // Check if provider should show customer info fields
    const needsCustomerInfo = selectedProvider && selectedMethod && shouldShowCustomerInfo(selectedProvider, selectedMethod);
    
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
    } else if (needsCustomerInfo) {
      // For providers that show customer info fields, require manual entry and validation
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
    } else {
      // For other providers (redirect providers, etc.), use authenticated user's info or empty
      finalCustomerName = user?.name || '';
      finalCustomerPhone = user?.phone || '';
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
            {step === 'billingInfo' && (t('payments.billingInformationDesc') || 'Please enter your billing information')}
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
              {/* Show method selection for all providers including credit cards */}
              <PaymentMethodSelect
                provider={selectedProvider}
                selectedMethod={selectedMethod}
                onSelectMethod={setSelectedMethod}
              />
              
              {/* Customer Information - Only show for specific providers that require customer info */}
              {selectedProvider && selectedMethod && selectedMethod !== 'QR' && selectedMethod !== null && !isCreditCardProvider(selectedProvider) && shouldShowCustomerInfo(selectedProvider, selectedMethod) && (
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

          {step === 'billingInfo' && isCreditCardProvider(selectedProvider) && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    {t('payments.email') || 'Email'} <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder={t('payments.emailPlaceholder') || 'Enter your email'}
                      className={`pl-10 pr-10 ${
                        email && emailValidation.isValid
                          ? 'border-green-500 focus-visible:ring-green-500'
                          : email && !emailValidation.isValid
                          ? 'border-red-500 focus-visible:ring-red-500'
                          : ''
                      }`}
                      required
                    />
                    {email && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {emailValidation.isValid ? (
                          <CheckCircle2Icon className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {email && !emailValidation.isValid && emailValidation.error && (
                    <p className="text-sm text-red-500">
                      {emailValidation.error === 'required' &&
                        (t('payments.emailRequired') || 'Email is required')}
                      {emailValidation.error === 'invalid' &&
                        (t('payments.emailInvalid') || 'Please enter a valid email address')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billAddress">
                    {t('payments.billingAddress') || 'Billing Address'} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="billAddress"
                    type="text"
                    value={billAddress}
                    onChange={(e) => setBillAddress(e.target.value)}
                    placeholder={t('payments.billingAddressPlaceholder') || 'Enter your billing address (e.g., No.70, Thukha street, ...)'}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billCity">
                    {t('payments.billingCity') || 'Billing City'} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="billCity"
                    type="text"
                    value={billCity}
                    onChange={(e) => setBillCity(e.target.value)}
                    placeholder={t('payments.billingCityPlaceholder') || 'Enter your billing city (e.g., Yangon)'}
                    required
                  />
                </div>
              </div>
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
              {/* Show message if payment gateway opened in new tab */}
              {redirectOpenedInNewTab && (
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center">
                      <AlertCircle className="h-8 w-8 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        {t('payments.paymentGatewayOpened') || 'Payment Gateway Opened'}
                      </h3>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                        {t('payments.paymentGatewayOpenedDesc') || 'A new tab has been opened for payment. Please complete your payment in that tab. This window will automatically update when payment is confirmed.'}
                      </p>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-900 rounded border space-y-3">
                      <div className="flex items-center justify-between">
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
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {t('payments.transactionNum') || 'Transaction Number'}
                        </span>
                        <span className="font-mono text-sm">{paymentData.transactionNum}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Show QR code if QR code exists */}
              {!redirectOpenedInNewTab && selectedMethod === 'QR' && paymentData.qrCode && (
                <QRCodeDisplay
                  qrCode={paymentData.qrCode}
                  amount={paymentData.amount}
                  orderId={paymentData.merchOrderId}
                  transactionNum={paymentData.transactionNum}
                  providerName={selectedProvider || ''}
                />
              )}

              {/* Show PIN instructions if method is PIN/PWA and not redirected to new tab */}
              {!redirectOpenedInNewTab && selectedMethod !== 'QR' && (
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
                    (isCreditCardProvider(selectedProvider) && selectedMethod !== 'OTP') ||
                    (!isCreditCardProvider(selectedProvider) && selectedMethod !== 'QR' && shouldShowCustomerInfo(selectedProvider, selectedMethod) && (!customerName.trim() || !customerPhone.trim() || !phoneValidation.isValid)) ||
                    (!isCreditCardProvider(selectedProvider) && selectedMethod === 'QR' && (!user?.name || !user?.phone || !phoneValidation.isValid))
                  }
                >
                  {t('payments.continue') || 'Continue'}
                </Button>
            </>
          )}

          {step === 'billingInfo' && (
            <>
              <Button variant="outline" onClick={() => setStep('select')}>
                {t('payments.back') || 'Back'}
              </Button>
              <Button
                onClick={() => {
                  // Validate billing info for credit cards
                  if (!email.trim()) {
                    setEmailValidation({ isValid: false, error: 'required' });
                    return;
                  }
                  
                  // Validate email format
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(email.trim())) {
                    setEmailValidation({ isValid: false, error: 'invalid' });
                    return;
                  }
                  
                  if (!billAddress.trim()) {
                    return;
                  }
                  
                  if (!billCity.trim()) {
                    return;
                  }
                  
                  // All validations passed, proceed to payment
                  setStep('processing');
                  paymentTokenMutation.mutate({
                    providerName: selectedProvider || '',
                    methodName: 'OTP',
                    packageId: pkg?.id || 0,
                    email: email.trim(),
                    billAddress: billAddress.trim(),
                    billCity: billCity.trim(),
                    customerName: user?.name || '',
                    customerPhone: user?.phone || '',
                  });
                }}
                disabled={
                  !email.trim() || 
                  !emailValidation.isValid || 
                  !billAddress.trim() || 
                  !billCity.trim()
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

