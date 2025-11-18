import { useState } from 'react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOtpRequest } from '@/hooks/mutations/useOtpRequest';
import { storeOtpRequestedPhone } from '@/utils/signupFlow';
import type { OtpRequestRequest } from '@/types/auth';

interface OtpRequestFormProps {
  onSuccess: (phone: string) => void;
}

const PHONE_PREFIX = '09';
const PHONE_LENGTH = 9; // digits after prefix
const TOTAL_PHONE_LENGTH = 11; // prefix + digits
const COUNTRY_CODE = '+95';

export function OtpRequestForm({ onSuccess }: OtpRequestFormProps) {
  const { t } = useLanguage();
  const { mutate: requestOtp, isPending } = useOtpRequest();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const formatPhoneNumber = (phone: string): string => {
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.startsWith(PHONE_PREFIX)) {
      return cleanPhone;
    }
    
    if (cleanPhone.length === PHONE_LENGTH && !cleanPhone.startsWith(PHONE_PREFIX)) {
      return `${PHONE_PREFIX}${cleanPhone}`;
    }
    
    if (cleanPhone.length === TOTAL_PHONE_LENGTH && !cleanPhone.startsWith(PHONE_PREFIX)) {
      return `${PHONE_PREFIX}${cleanPhone.slice(2)}`;
    }
    
    return cleanPhone;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const formattedPhone = formatPhoneNumber(phone);
    return /^09\d{9}$/.test(formattedPhone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    // Remove leading 09 if user types it (since we show +95 separately)
    if (value.startsWith('09')) {
      value = value.slice(2);
    }
    // Only allow digits, max 9 digits (without 09 prefix since we show +95 separately)
    if (value.length <= PHONE_LENGTH) {
      setPhone(value);
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Add 09 prefix to the phone number
    const formattedPhone = phone.startsWith('09') ? phone : `09${phone}`;
    
    if (!phone) {
      setError(t('signup.otpRequest.phoneRequired') || 'Phone number is required');
      return;
    }

    if (phone.length !== PHONE_LENGTH) {
      setError(t('signup.otpRequest.phoneInvalid') || 'Please enter a valid phone number');
      return;
    }

    if (!validatePhoneNumber(formattedPhone)) {
      setError(t('signup.otpRequest.phoneInvalid') || 'Please enter a valid phone number');
      return;
    }

    const payload: OtpRequestRequest = {
      phone: formattedPhone,
      type: 'phone',
      action_type: 'register',
    };

    requestOtp(payload, {
      onSuccess: (response) => {
        // Store phone and action type in sessionStorage for flow protection
        const responseActionType = response.data?.action || 'register';
        storeOtpRequestedPhone(formattedPhone, responseActionType);
        onSuccess(formattedPhone);
      },
      onError: (error: any) => {
        const apiErrors = error?.response?.data?.errors;
        if (apiErrors && Object.keys(apiErrors).length > 0) {
          const firstError = Object.values(apiErrors)[0] as string[];
          setError(firstError?.[0] || 'Failed to send OTP. Please try again.');
        } else {
          setError(error?.response?.data?.message || 'Failed to send OTP. Please try again.');
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Phone className="h-4 w-4" />
          {t('signup.otpRequest.phoneNumber') || 'Phone Number'}
        </Label>
        <div className="flex gap-2">
          {/* Non-editable prefix */}
          <div className="flex items-center px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-medium">
            {COUNTRY_CODE}
          </div>
          {/* Editable phone input */}
          <Input
            id="phone"
            type="tel"
            placeholder="9xxxxxxxxx"
            value={phone}
            onChange={handlePhoneChange}
            className={`flex-1 ${error ? 'border-red-500' : ''}`}
            disabled={isPending}
            maxLength={PHONE_LENGTH}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>

      {/* Continue Button */}
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-white"
        disabled={isPending || !phone}
      >
        {isPending ? (
          t('signup.otpRequest.sendingOtp') || 'Sending OTP...'
        ) : (
          <>
            {t('signup.otpRequest.continue') || 'Continue'} →
          </>
        )}
      </Button>
    </form>
  );
}

