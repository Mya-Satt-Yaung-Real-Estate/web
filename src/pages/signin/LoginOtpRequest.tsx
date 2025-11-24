import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Globe, ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SEOHead } from '@/components/seo/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/stores/authStore';
import { useModal } from '@/contexts/ModalContext';
import { LoginOtpRequestForm } from './components';
import logoImage from '@/assets/jade.png';

export function LoginOtpRequest() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();
  const { isAuthenticated, signInAsGuest } = useAuthStore();
  const { showSuccess } = useModal();

  // Redirect authenticated users to profile page
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Show nothing while redirecting
  if (isAuthenticated) {
    return null;
  }

  // Get phone from location state if available
  const phoneFromState = location.state?.phone as string | undefined;

  const handleSuccess = (phone: string) => {
    // Navigate to unified OTP verify page with phone in state
    navigate('/signin/otp-verify', { state: { phone } });
  };

  const handleBack = () => {
    navigate('/signin');
  };

  const handleGuestSignIn = () => {
    signInAsGuest();
    showSuccess(
      t('signin.guestMessage') || 'Guest Access',
      t('signin.guestAccess') || 'Browse properties without creating an account'
    );
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      <SEOHead
        seo={{
          title: `${t('signin.otpRequest.title') || 'Login with OTP'} - Jade Property`,
          description: t('signin.otpRequest.subtitle') || 'Enter your phone number to receive OTP',
          keywords: 'signin, login, OTP, Jade Property',
        }}
        path="/signin/otp-request"
      />

      {/* Header with Back Button and Language Selector */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <Button
          variant="default"
          size="sm"
          onClick={handleBack}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back') || 'Back'}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-2 text-sm"
            >
              <Globe className="h-4 w-4" />
              <span>{language === 'mm' ? 'မြန်မာ' : 'English'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              onClick={() => setLanguage('en')}
              className={language === 'en' ? 'bg-primary/10' : ''}
            >
              <span className={language === 'en' ? 'text-primary' : ''}>🇬🇧 {t('language.english')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setLanguage('mm')}
              className={language === 'mm' ? 'bg-primary/10' : ''}
            >
              <span className={language === 'mm' ? 'text-primary' : ''}>🇲🇲 {t('language.myanmar')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* White Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Logo Section */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <img 
                  src={logoImage} 
                  alt="Jade Property Logo" 
                  className="w-16 h-16 object-contain rounded-xl"
                />
              </div>
              <p className="text-sm text-gray-500 mb-1">
                {t('signin.otpRequest.welcomeBack') || 'WELCOME BACK'}
              </p>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {t('signin.otpRequest.appName') || 'Jade Property'}
              </h1>
              <p className="text-sm text-gray-500">
                {t('signin.otpRequest.enterPhoneNumber') || 'Enter Phone Number'}
              </p>
            </div>

            {/* Form */}
            <LoginOtpRequestForm 
              onSuccess={handleSuccess} 
              initialPhone={phoneFromState}
            />

            {/* OR Separator */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">{t('signin.otpRequest.or') || 'OR'}</span>
              </div>
            </div>

            {/* Continue as Guest */}
            <Button
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={handleGuestSignIn}
            >
              <User className="h-4 w-4 mr-2" />
              {t('signin.otpRequest.continueAsGuest') || 'Continue as Guest'}
            </Button>

            {/* Guest Access Description */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 mb-1">
                {t('signin.otpRequest.guestAccess') || 'Guest Access'}
              </p>
              <p className="text-xs text-gray-400">
                {t('signin.otpRequest.guestDescription') || 'Browse properties without creating an account'}
              </p>
            </div>

            {/* Sign Up Link - removed since unified flow */}
          </div>
        </div>
      </div>
    </div>
  );
}

