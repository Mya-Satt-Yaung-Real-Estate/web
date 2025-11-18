import { useState, useRef, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOtpVerify } from '@/hooks/mutations/useOtpVerify';
import { useOtpRequest } from '@/hooks/mutations/useOtpRequest';
import { storeOtpVerified, storeOtpRequestedPhone, getOtpActionType } from '@/utils/signupFlow';
import type { OtpVerifyRequest, OtpRequestRequest } from '@/types/auth';

interface OtpVerifyFormProps {
  phone: string;
  onSuccess: () => void;
}

const RESEND_COUNTDOWN_SECONDS = 60;

export function OtpVerifyForm({ phone, onSuccess }: OtpVerifyFormProps) {
  const { t } = useLanguage();
  const { mutate: verifyOtp, isPending } = useOtpVerify();
  const { mutate: requestOtp } = useOtpRequest();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Format phone for display: +95 9XXXXXXXXX (remove leading 0)
  const formatDisplayPhone = (phoneNum: string): string => {
    let cleanPhone = phoneNum.startsWith('09') ? phoneNum.slice(1) : phoneNum;
    if (!cleanPhone.startsWith('9')) {
      cleanPhone = `9${cleanPhone}`;
    }
    return `+95 ${cleanPhone}`;
  };
  const displayPhone = formatDisplayPhone(phone);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // Start countdown when component mounts
  useEffect(() => {
    setResendCountdown(RESEND_COUNTDOWN_SECONDS);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '');
    if (digit.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      setError('');
      // Focus last input
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError(t('signup.otpVerify.invalidOtp') || 'Please enter a valid 6-digit OTP code');
      return;
    }

    // Get action type from sessionStorage (stored during OTP request)
    const actionType = getOtpActionType() || 'register';

    const payload: OtpVerifyRequest = {
      phone: phone.startsWith('09') ? phone : `09${phone}`,
      type: 'phone',
      otp_code: otpCode,
      action_type: actionType as 'register' | 'login' | 'forgot_password',
    };

    verifyOtp(payload, {
      onSuccess: (response) => {
        // For register action, response.data contains phone and action
        // For login action, response.data contains user and token (handled separately)
        if (response.data?.phone && response.data?.action === 'register') {
          // Store OTP verification status in sessionStorage
          storeOtpVerified(phone.startsWith('09') ? phone : `09${phone}`);
          onSuccess();
        } else {
          // This shouldn't happen for register flow, but handle it
          setError('Unexpected response. Please try again.');
        }
      },
      onError: (error: any) => {
        const apiErrors = error?.response?.data?.errors;
        if (apiErrors && Object.keys(apiErrors).length > 0) {
          const firstError = Object.values(apiErrors)[0] as string[];
          setError(firstError?.[0] || 'Invalid OTP code. Please try again.');
        } else {
          setError(error?.response?.data?.message || 'Invalid OTP code. Please try again.');
        }
      },
    });
  };

  const handleResend = () => {
    if (resendCountdown > 0) return;

    setError('');
    // Use stored action type or default to 'register'
    const storedActionType = getOtpActionType() || 'register';
    const payload: OtpRequestRequest = {
      phone: phone.startsWith('09') ? phone : `09${phone}`,
      type: 'phone',
      action_type: storedActionType as 'register' | 'forgot_password',
    };

    requestOtp(payload, {
      onSuccess: (response) => {
        // Update phone and action type in sessionStorage on resend
        const actionType = response.data?.action || storedActionType;
        storeOtpRequestedPhone(phone.startsWith('09') ? phone : `09${phone}`, actionType);
        setResendCountdown(RESEND_COUNTDOWN_SECONDS);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      },
      onError: (error: any) => {
        const apiErrors = error?.response?.data?.errors;
        if (apiErrors && Object.keys(apiErrors).length > 0) {
          const firstError = Object.values(apiErrors)[0] as string[];
          setError(firstError?.[0] || 'Failed to resend OTP. Please try again.');
        } else {
          setError(error?.response?.data?.message || 'Failed to resend OTP. Please try again.');
        }
      },
    });
  };

  return (
    <form onSubmit={handleVerify} className="space-y-6">
      {/* Phone Number Display */}
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-2">
          {t('signup.otpVerify.sentCodeTo') || 'We sent a code to'}
        </p>
        <div className="flex items-center justify-center gap-2 text-primary font-medium">
          <Phone className="h-4 w-4" />
          <span>{displayPhone}</span>
        </div>
      </div>

      {/* OTP Input */}
      <div className="space-y-2">
        <label className="text-sm text-gray-500 block">
          {t('signup.otpVerify.enterOtpCode') || 'Enter OTP Code'}
        </label>
        <div className="flex gap-2 justify-center">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={`w-12 h-12 text-center text-lg font-semibold ${
                error ? 'border-red-500' : ''
              }`}
              disabled={isPending}
            />
          ))}
        </div>
        {error && (
          <p className="text-sm text-red-600 text-center mt-2">{error}</p>
        )}
      </div>

      {/* Verify Button */}
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-white"
        disabled={isPending || otp.join('').length !== 6}
      >
        {isPending ? (t('signup.otpVerify.verifying') || 'Verifying...') : (t('signup.otpVerify.verify') || 'Verify')}
      </Button>

      {/* Resend OTP */}
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-1">
          {t('signup.otpVerify.didntReceive') || "Didn't receive the code?"}
        </p>
        {resendCountdown > 0 ? (
          <p className="text-sm text-primary">
            {t('signup.otpVerify.resendIn') || 'Resend in'} {resendCountdown}s
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-sm text-primary hover:underline font-medium"
          >
            {t('signup.otpVerify.resend') || 'Resend'}
          </button>
        )}
      </div>
    </form>
  );
}

