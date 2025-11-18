import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/stores/authStore';
import { useRegisterIndividual } from '@/hooks/mutations/useRegister';
import type { RegisterIndividualRequest } from '@/types/auth';

interface IndividualFieldsProps {
  phone: string;
  onSuccess: () => void;
}

export function IndividualFields({ phone, onSuccess }: IndividualFieldsProps) {
  const { t } = useLanguage();
  const { setToken, checkAuth } = useAuthStore();
  const { mutate: register, isPending } = useRegisterIndividual();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('signup.register.nameRequired') || 'Name is required';
    }

    // Email is optional, but if provided, must be valid
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('signup.register.emailInvalid') || 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = t('signup.register.passwordRequired') || 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = t('signup.register.passwordMinLength') || 'Password must be at least 8 characters';
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = t('signup.register.confirmPasswordRequired') || 'Password confirmation is required';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = t('signup.register.passwordMismatch') || 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const payload: RegisterIndividualRequest = {
      name: formData.name.trim(),
      email: formData.email.trim() || undefined,
      phone: phone.startsWith('09') ? phone : `09${phone}`,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
    };

    register(payload, {
      onSuccess: async (response) => {
        // Store token and authenticate user
        setToken(response.data.token);
        await checkAuth();
        
        // Call parent success handler
        onSuccess();
      },
      onError: (error: any) => {
        const apiErrors = error?.response?.data?.errors;
        if (apiErrors && Object.keys(apiErrors).length > 0) {
          const newErrors: Record<string, string> = {};
          Object.keys(apiErrors).forEach((key) => {
            const errorMessages = apiErrors[key] as string[];
            newErrors[key] = errorMessages?.[0] || '';
          });
          setErrors(newErrors);
        } else {
          setErrors({
            general: error?.response?.data?.message || 'Registration failed. Please try again.',
          });
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="rounded-lg border border-red-500 bg-red-50 p-4 text-red-700 text-sm">
          {errors.general}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
          {t('signup.register.name') || 'Name'}
        </Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={handleChange('name')}
          className={errors.name ? 'border-red-500' : ''}
          disabled={isPending}
          placeholder={t('signup.register.namePlaceholder') || 'Enter your name'}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Mail className="h-4 w-4" />
          {t('signup.register.email') || 'Email'}
          <span className="text-gray-400 text-xs ml-1">({t('common.optional') || 'Optional'})</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          className={errors.email ? 'border-red-500' : ''}
          disabled={isPending}
          placeholder={t('signup.register.emailPlaceholder') || 'you@example.com'}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Lock className="h-4 w-4" />
          {t('signup.register.password') || 'Password'}
        </Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          className={errors.password ? 'border-red-500' : ''}
          disabled={isPending}
          placeholder={t('signup.register.passwordPlaceholder') || 'Enter password (min 8 characters)'}
        />
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">
          {t('signup.register.confirmPassword') || 'Confirm Password'}
        </Label>
        <Input
          id="password_confirmation"
          type="password"
          value={formData.password_confirmation}
          onChange={handleChange('password_confirmation')}
          className={errors.password_confirmation ? 'border-red-500' : ''}
          disabled={isPending}
          placeholder={t('signup.register.confirmPasswordPlaceholder') || 'Confirm your password'}
        />
        {errors.password_confirmation && (
          <p className="text-sm text-red-600">{errors.password_confirmation}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-white"
        disabled={isPending}
      >
        {isPending ? (t('signup.register.registering') || 'Registering...') : (t('signup.register.register') || 'Register')}
      </Button>
    </form>
  );
}

