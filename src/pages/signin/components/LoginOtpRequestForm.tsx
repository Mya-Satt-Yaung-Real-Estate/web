import { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOtpRequest } from '@/hooks/mutations/useOtpRequest';
import { storeOtpRequestedPhone } from '@/utils/signupFlow';
import type { OtpRequestRequest } from '@/types/auth';

interface LoginOtpRequestFormProps {
  onSuccess: (phone: string) => void;
  initialPhone?: string;
}

const PHONE_PREFIX = '0';
const SHORT_PHONE_LENGTH = 7; // User input: 7 digits starting with 9 (e.g., 9505050)
const MEDIUM_PHONE_LENGTH = 8; // User input: 8 digits starting with 9 (e.g., 95050506)
const LONG_PHONE_LENGTH = 10; // User input: 10 digits starting with 9 (e.g., 9971238411)
const MAX_PHONE_LENGTH = 10; // Maximum allowed input length
const COUNTRY_CODE = '+95';

export function LoginOtpRequestForm({ onSuccess, initialPhone }: LoginOtpRequestFormProps) {
  const { t } = useLanguage();
  const { mutate: requestOtp, isPending } = useOtpRequest();
  const [phone, setPhone] = useState(initialPhone || '');
  const [error, setError] = useState('');

  // Update phone if initialPhone changes
  useEffect(() => {
    if (initialPhone) {
      // Remove 0 or 09 prefix if present since we show +95 separately and number starts with 9
      let phoneWithoutPrefix = initialPhone;
      if (initialPhone.startsWith('09')) {
        phoneWithoutPrefix = initialPhone.slice(2);
      } else if (initialPhone.startsWith('0')) {
        phoneWithoutPrefix = initialPhone.slice(1);
      }
      setPhone(phoneWithoutPrefix);
    }
  }, [initialPhone]);

  const formatPhoneNumber = (phone: string): string => {
    const cleanPhone = phone.replace(/\D/g, '');
    
    // If already starts with 0 (like 095050506 or 09971238411), return as is
    if (cleanPhone.startsWith('0')) {
      return cleanPhone;
    }
    
    // If 7, 8, or 10 digits starting with 9, add 0 prefix
    if ((cleanPhone.length === SHORT_PHONE_LENGTH || cleanPhone.length === MEDIUM_PHONE_LENGTH || cleanPhone.length === LONG_PHONE_LENGTH) && cleanPhone.startsWith('9')) {
      return `${PHONE_PREFIX}${cleanPhone}`;
    }
    
    // If 9, 10, or 11 digits without 0 prefix, extract and add 0
    if ((cleanPhone.length === 9 || cleanPhone.length === 10 || cleanPhone.length === 11) && !cleanPhone.startsWith('0')) {
      return `${PHONE_PREFIX}${cleanPhone.slice(1)}`; // Remove first digit and add 0
    }
    
    return cleanPhone;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const formattedPhone = formatPhoneNumber(phone);
    // Validates: 09 followed by 7-9 digits = 9-11 digits total (e.g., 095030559 or 09971238411)
    return /^09\d{7,9}$/.test(formattedPhone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    // Remove leading 0 or 09 if user types it (since we show +95 separately and number starts with 9)
    if (value.startsWith('09')) {
      value = value.slice(2);
    } else if (value.startsWith('0')) {
      value = value.slice(1);
    }

    // If user types digits that don't start with 9, automatically prepend 9
    // Example: 5050506 (7 digits) → 95050506 (8 digits)
    // Example: 505050 (6 digits) → 9505050 (7 digits)
    if (value.length > 0 && !value.startsWith('9')) {
      // If it's 6-9 digits not starting with 9, prepend 9
      // This allows: 5050506 → 95050506, 505050 → 9505050
      if (value.length >= 6 && value.length <= 9) {
        value = '9' + value;
      } else if (value.length < 6) {
        // For shorter inputs, just prepend 9
        value = '9' + value;
      }
    }

    // Only allow digits, max 10 digits total (must start with 9)
    if (value.length <= MAX_PHONE_LENGTH) {
      setPhone(value);
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Add 0 prefix to the phone number (since it already starts with 9, becomes 09XXXXXXXXX = 9-11 digits)
    // Input: 9505050 (7 digits) → Output: 09505050 (9 digits)
    // Input: 95050506 (8 digits) → Output: 095050506 (9 digits)
    // Input: 9971238411 (10 digits) → Output: 09971238411 (11 digits)
    const formattedPhone = phone.startsWith('0') ? phone : `${PHONE_PREFIX}${phone}`;
    
    if (!phone) {
      setError(t('signin.otpRequest.phoneRequired') || 'Phone number is required');
      return;
    }

    // Input must be exactly 7, 8, or 10 digits (e.g., 9505050, 95050506, or 9971238411)
    if (phone.length !== SHORT_PHONE_LENGTH && phone.length !== MEDIUM_PHONE_LENGTH && phone.length !== LONG_PHONE_LENGTH) {
      setError(t('signin.otpRequest.phoneInvalid') || 'Please enter a valid phone number');
      return;
    }

    // Input must start with 9
    if (!phone.startsWith('9')) {
      setError(t('signin.otpRequest.phoneInvalid') || 'Phone number must start with 9');
      return;
    }

    // Final formatted phone must be 9-11 digits (09505050, 095050506, or 09971238411)
    if (!validatePhoneNumber(formattedPhone)) {
      setError(t('signin.otpRequest.phoneInvalid') || 'Please enter a valid phone number');
      return;
    }

    const payload: OtpRequestRequest = {
      phone: formattedPhone,
      type: 'phone',
    };

    requestOtp(payload, {
      onSuccess: () => {
        // Store phone in sessionStorage for flow protection
        storeOtpRequestedPhone(formattedPhone);
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
          {t('signin.otpRequest.phoneNumber') || 'Phone Number'}
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
            maxLength={MAX_PHONE_LENGTH}
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
          t('signin.otpRequest.sendingOtp') || 'Sending OTP...'
        ) : (
          <>
            {t('signin.otpRequest.continue') || 'Continue'} →
          </>
        )}
      </Button>
    </form>
  );
}

