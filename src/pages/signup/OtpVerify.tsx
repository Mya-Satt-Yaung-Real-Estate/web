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
import { getOtpRequestedPhone } from '@/utils/signupFlow';
import { OtpVerifyForm } from './components';
import logoImage from '@/assets/jade.png';

export function OtpVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();
  const { isAuthenticated } = useAuthStore();

  // Get phone from sessionStorage (primary) or location state (fallback)
  const phoneFromStorage = getOtpRequestedPhone();
  const phoneFromState = location.state?.phone as string | undefined;
  const phone = phoneFromStorage || phoneFromState;

  // Redirect authenticated users to profile page
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Redirect to OTP request if no valid phone found
  useEffect(() => {
    if (!phone) {
      navigate('/signup', { replace: true });
    }
  }, [phone, navigate]);

  // Show nothing while redirecting if authenticated or no phone
  if (isAuthenticated || !phone) {
    return null;
  }

  const handleSuccess = () => {
    // Navigate to register page with verified phone
    navigate('/signup/register', { state: { phone } });
  };

  const handleBack = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      <SEOHead
        seo={{
          title: `${t('signup.otpVerify.title') || 'Verify OTP'} - Jade Property`,
          description: t('signup.otpVerify.subtitle') || 'Verify your phone number with OTP',
          keywords: 'signup, verify, OTP, Jade Property',
        }}
        path="/signup/verify-otp"
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
          {/* White Modal/Pop-up */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Logo Section */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <img 
                  src={logoImage} 
                  alt="Jade Property Logo" 
                  className="w-16 h-16 object-contain rounded-xl"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {t('signup.otpVerify.title') || 'Verify Phone Number'}
              </h2>
            </div>

            {/* Form */}
            <OtpVerifyForm phone={phone} onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
}

