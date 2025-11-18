import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';
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
import { getVerifiedPhone, clearSignupFlow } from '@/utils/signupFlow';
import { RegisterForm } from './components';
import logoImage from '@/assets/jade.png';

export function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();
  const { isAuthenticated } = useAuthStore();
  const { showSuccess } = useModal();

  // Get phone from sessionStorage (primary) or location state (fallback)
  const phoneFromStorage = getVerifiedPhone();
  const phoneFromState = location.state?.phone as string | undefined;
  const phone = phoneFromStorage || phoneFromState;

  // Redirect authenticated users to profile page
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Redirect to OTP request if no valid phone or OTP not verified
  useEffect(() => {
    if (!phone || !phoneFromStorage) {
      // OTP not verified, redirect to OTP request
      navigate('/signup', { replace: true });
    }
  }, [phone, phoneFromStorage, navigate]);

  // Show nothing while redirecting if authenticated or no phone/OTP verified
  if (isAuthenticated || !phone || !phoneFromStorage) {
    return null;
  }

  const handleSuccess = async () => {
    // Clear signup flow data
    clearSignupFlow();
    
    // Show success message
    showSuccess(
      t('signup.register.success') || 'Registration successful!',
      t('signup.register.welcome') || 'Welcome to Jade Property'
    );
    
    // Auto-login will be handled by the mutation hook
    // Navigate to profile page (user is already authenticated with token)
    navigate('/profile');
  };

  const handleBack = () => {
    navigate('/signup/verify-otp');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      <SEOHead
        seo={{
          title: `${t('signup.register.title') || 'Register'} - Jade Property`,
          description: t('signup.register.subtitle') || 'Create your account',
          keywords: 'signup, register, account, Jade Property',
        }}
        path="/signup/register"
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
        <div className="w-full max-w-2xl">
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
                {t('signup.otpRequest.welcomeTo') || 'WELCOME TO'}
              </p>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {t('signup.otpRequest.appName') || 'Jade Property'}
              </h1>
              <p className="text-sm text-gray-500">
                {t('signup.register.title') || 'Create Your Account'}
              </p>
            </div>

            {/* Form */}
            <RegisterForm phone={phone} onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
}

