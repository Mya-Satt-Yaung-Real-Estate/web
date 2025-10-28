import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, UserCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SEOHead } from '@/components/seo/SEOHead';

import { useAuthStore } from '@/stores/authStore';
import { useModal } from '@/contexts/ModalContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLogin } from '@/hooks/mutations/useLogin';

import logoImage from '@/assets/jade.png';
import type { LoginRequest } from '@/types/auth';

interface FormState {
  email: string;
  password: string;
  phone: string;
  phonePassword: string;
}

interface ErrorState {
  generalError: string;
}

const PHONE_PREFIX = '09';
const PHONE_LENGTH = 9; // digits after prefix
const TOTAL_PHONE_LENGTH = 11; // prefix + digits

export function SignIn() {
  const navigate = useNavigate();
  const { signInAsGuest, checkAuth, setToken } = useAuthStore();
  const { showSuccess } = useModal();
  const { t } = useLanguage();
  const { mutate: login, isPending } = useLogin();

  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
    phone: '',
    phonePassword: ''
  });

  const [errorState, setErrorState] = useState<ErrorState>({
    generalError: ''
  });

  const clearErrors = () => {
    setErrorState(prev => ({ ...prev, generalError: '' }));
  };

  const handleApiError = (error: any, fallbackMessage: string) => {
    const apiErrors = error?.response?.data?.errors;
    
    if (apiErrors && Object.keys(apiErrors).length > 0) {
      const firstError = Object.values(apiErrors)[0] as string[];
      const errorMessage = firstError?.[0] || fallbackMessage;
      setErrorState(prev => ({ ...prev, generalError: errorMessage }));
    } else {
      const errorMessage = error?.response?.data?.message || fallbackMessage;
      setErrorState(prev => ({ ...prev, generalError: errorMessage }));
    }
  };

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

  const updateFormField = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, [field]: e.target.value }));
    if (errorState.generalError) clearErrors();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormState(prev => ({ ...prev, phone: value }));
    if (errorState.generalError) clearErrors();
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    const loginData: LoginRequest = {
      type: 'email',
      email: formState.email,
      password: formState.password
    };

    login(loginData, {
      onSuccess: async (response) => {
        // Store token in Zustand store
        setToken(response.data.token);
        
        // Refresh auth context to get user data
        await checkAuth();
        
        showSuccess(
          t('signin.welcomeBack'),
          t('signin.signInSuccessful')
        );
        navigate('/');
      },
      onError: (error: any) => {
        const fallbackMessage = t('signin.signInFailed');
        handleApiError(error, fallbackMessage);
      }
    });
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    if (!validatePhoneNumber(formState.phone)) {
      const errorMessage = t('signin.phoneValidationError');
      setErrorState(prev => ({ ...prev, generalError: errorMessage }));
      return;
    }
    
    const loginData: LoginRequest = {
      type: 'phone',
      phone: formatPhoneNumber(formState.phone),
      password: formState.phonePassword
    };

    login(loginData, {
      onSuccess: async (response) => {
        // Store token in Zustand store
        setToken(response.data.token);
        
        // Refresh auth context to get user data
        await checkAuth();
        
        showSuccess(
          t('signin.welcomeBack'),
          t('signin.signInSuccessful')
        );
        navigate('/');
      },
      onError: (error: any) => {
        const fallbackMessage = t('signin.invalidPhonePassword');
        handleApiError(error, fallbackMessage);
      }
    });
  };

  const handleGuestSignIn = () => {
    signInAsGuest();
    showSuccess(
      t('signin.guestMessage'),
      t('signin.guestAccess')
    );
    navigate('/');
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-primary/5 to-[#4a9b82]/10 pt-24 pb-16 px-4 flex items-center justify-center">
      <SEOHead
        seo={{
          title: `${t('signin.title')} - Jade Property`,
          description: t('signin.subtitle'),
          keywords: `${t('signin.title')}, account, Jade Property`
        }}
        path="/signin"
      />
      
      <Card className="w-full max-w-md shadow-2xl border-border/50 backdrop-blur-sm glass relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
        
        <CardHeader className="text-center relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl blur-sm" />
            <img 
              src={logoImage} 
              alt="Jade Property Logo" 
              className="w-full h-full rounded-2xl shadow-lg shadow-primary/30 relative z-10 border-2 border-primary/20"
            />
          </div>
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent mb-2">
            {t('signin.title')}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {t('signin.subtitle')}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10">
          {errorState.generalError && (
            <div className="mb-6 rounded-lg border border-red-500 bg-red-50 p-4 text-red-700">
              <p className="text-sm font-medium">
                {errorState.generalError}
              </p>
            </div>
          )}

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 backdrop-blur-sm border border-border/50">
              <TabsTrigger value="email" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <Mail className="h-4 w-4 mr-2" />
                {t('signin.email')}
              </TabsTrigger>
              <TabsTrigger value="phone" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <Phone className="h-4 w-4 mr-2" />
                {t('signin.phone')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <form onSubmit={handleEmailSignIn} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                    {t('signin.email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('signin.emailPlaceholder')}
                    value={formState.email}
                    onChange={updateFormField('email')}
                    autoComplete="email"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    required
                    className="h-12 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background/50 backdrop-blur-sm border-border/50"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                    {t('signin.password')}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formState.password}
                    onChange={updateFormField('password')}
                    autoComplete="current-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    required
                    className="h-12 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background/50 backdrop-blur-sm border-border/50"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 gradient-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105 font-semibold text-base" 
                  disabled={isPending}
                >
                  {isPending ? t('signin.signingIn') : t('signin.signIn')}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="phone">
              <form onSubmit={handlePhoneSignIn} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-sm font-medium text-muted-foreground">
                    {t('signin.phoneNumber')}
                  </Label>
                  <div className="flex">
                    <div className="flex items-center px-3 py-2 bg-muted border border-r-0 border-border rounded-l-md text-sm font-medium text-foreground">
                      {PHONE_PREFIX}
                    </div>
                    <Input
                      id="phone"
                      name="user-phone-digits"
                      type="text"
                      value={formState.phone}
                      onChange={handlePhoneChange}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      data-form-type="other"
                      data-lpignore="true"
                      data-1p-ignore="true"
                      required
                      className="h-12 rounded-l-none border-l-0 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background/50 backdrop-blur-sm border-border/50 [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill]:hidden text-sm font-normal"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="phonePassword" className="text-sm font-medium text-muted-foreground">
                    {t('signin.password')}
                  </Label>
                  <Input
                    id="phonePassword"
                    type="password"
                    placeholder="••••••••"
                    value={formState.phonePassword}
                    onChange={updateFormField('phonePassword')}
                    autoComplete="current-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    required
                    className="h-12 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background/50 backdrop-blur-sm border-border/50"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 gradient-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105 font-semibold text-base" 
                  disabled={isPending}
                >
                  {isPending ? t('signin.signingIn') : t('signin.signIn')}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-8 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-4 text-muted-foreground text-sm font-medium">
                  {t('signin.or')}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-12 hover:bg-primary/10 hover:text-primary transition-all border-border/50 bg-background/50 backdrop-blur-sm font-semibold"
              onClick={handleGuestSignIn}
            >
              <UserCircle className="mr-2 h-5 w-5" />
              {t('signin.continueAsGuest')}
            </Button>

            <p className="text-center text-muted-foreground text-sm">
              {t('signin.noAccount')}{' '}
              <Link 
                to="/signup" 
                className="text-primary hover:underline font-semibold transition-colors hover:text-primary/80"
              >
                {t('signin.signUp')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               