import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useModal } from '@/contexts/ModalContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Phone, UserCircle } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import logoImage from '@/assets/jade.png';

export function SignIn() {
  const navigate = useNavigate();
  const { signIn, signInWithPhone, signInAsGuest } = useAuth();
  const { showSuccess, showError } = useModal();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  // Email/Password form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Phone/Password form
  const [phone, setPhone] = useState('');
  const [phonePassword, setPhonePassword] = useState('');

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
      showSuccess(
        language === 'mm' ? 'ပြန်လည်ကြိုဆိုပါသည်!' : 'Welcome back!',
        language === 'mm' ? 'အောင်မြင်စွာဝင်ရောက်ပါပြီ' : 'Sign in successful'
      );
      navigate('/');
    } catch (error) {
      showError(
        language === 'mm' ? 'ဝင်ရောက်မှုမအောင်မြင်ပါ။ ကျေးဇူးပြု၍ထပ်ကြိုးစားပါ။' : 'Sign in failed. Please try again.',
        language === 'mm' ? 'အမှား' : 'Error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !phonePassword) {
      showError(
        language === 'mm' ? 'ဖုန်းနံပါတ်နှင့်စကားဝှက်ထည့်ရန်လိုအပ်ပါသည်' : 'Phone number and password are required',
        language === 'mm' ? 'အမှား' : 'Error'
      );
      return;
    }
    
    setIsLoading(true);
    try {
      await signInWithPhone(phone, phonePassword);
      showSuccess(
        language === 'mm' ? 'ပြန်လည်ကြိုဆိုပါသည်!' : 'Welcome back!',
        language === 'mm' ? 'အောင်မြင်စွာဝင်ရောက်ပါပြီ' : 'Sign in successful'
      );
      navigate('/');
    } catch (error) {
      showError(
        language === 'mm' ? 'ဖုန်းနံပါတ်သို့မဟုတ်စကားဝှက်မမှန်ပါ။ ကျေးဇူးပြု၍ထပ်ကြိုးစားပါ။' : 'Invalid phone number or password. Please try again.',
        language === 'mm' ? 'အမှား' : 'Error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestSignIn = () => {
    signInAsGuest();
    showSuccess(
      language === 'mm' ? 'ဧည့်သည်အနေဖြင့်ဝင်ရောက်ပါပြီ။ အချို့အင်္ဂါရပ်များကန့်သတ်ထားနိုင်ပါသည်။' : 'Signed in as guest. Some features may be limited.',
      language === 'mm' ? 'ဧည့်သည်ဝင်ရောက်မှု' : 'Guest Access'
    );
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-primary/5 to-[#4a9b82]/10 pt-24 pb-16 px-4 flex items-center justify-center">
      <SEOHead
        seo={{
          title: language === 'mm' ? 'ဝင်ရောက်ရန် - Jade Property' : 'Sign In - Jade Property',
          description: language === 'mm' ? 'Jade Property သို့ဝင်ရောက်ပါ' : 'Sign in to Jade Property',
          keywords: language === 'mm' ? 'ဝင်ရောက်ရန်, အကောင့်, Jade Property' : 'sign in, login, account, Jade Property'
        }}
        path="/signin"
      />
      
      <Card className="w-full max-w-md shadow-2xl border-border/50 backdrop-blur-sm glass relative overflow-hidden">
        {/* Decorative gradient overlay */}
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
            {language === 'mm' ? 'ဝင်ရောက်ရန်' : 'Sign In'}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {language === 'mm' ? 'Jade Property သို့ပြန်လည်ကြိုဆိုပါသည်' : 'Welcome back to Jade Property'}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 backdrop-blur-sm border border-border/50">
              <TabsTrigger value="email" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <Mail className="h-4 w-4 mr-2" />
                {language === 'mm' ? 'အီးမေးလ်' : 'Email'}
              </TabsTrigger>
              <TabsTrigger value="phone" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all">
                <Phone className="h-4 w-4 mr-2" />
                {language === 'mm' ? 'ဖုန်း' : 'Phone'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <form onSubmit={handleEmailSignIn} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                    {language === 'mm' ? 'အီးမေးလ်' : 'Email'}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={language === 'mm' ? 'you@example.com' : 'you@example.com'}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="h-12 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background/50 backdrop-blur-sm border-border/50"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                    {language === 'mm' ? 'စကားဝှက်' : 'Password'}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="h-12 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background/50 backdrop-blur-sm border-border/50"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 gradient-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105 font-semibold text-base" 
                  disabled={isLoading}
                >
                  {isLoading 
                    ? (language === 'mm' ? 'ဝင်ရောက်နေသည်...' : 'Signing in...') 
                    : (language === 'mm' ? 'ဝင်ရောက်ရန်' : 'Sign In')
                  }
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="phone">
              <form onSubmit={handlePhoneSignIn} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-sm font-medium text-muted-foreground">
                    {language === 'mm' ? 'ဖုန်းနံပါတ်' : 'Phone Number'}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={language === 'mm' ? '+959 123 456 789' : '+1 (234) 567-890'}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                    className="h-12 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background/50 backdrop-blur-sm border-border/50"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="phonePassword" className="text-sm font-medium text-muted-foreground">
                    {language === 'mm' ? 'စကားဝှက်' : 'Password'}
                  </Label>
                  <Input
                    id="phonePassword"
                    type="password"
                    placeholder="••••••••"
                    value={phonePassword}
                    onChange={e => setPhonePassword(e.target.value)}
                    required
                    className="h-12 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/50 bg-background/50 backdrop-blur-sm border-border/50"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 gradient-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105 font-semibold text-base" 
                  disabled={isLoading}
                >
                  {isLoading 
                    ? (language === 'mm' ? 'ဝင်ရောက်နေသည်...' : 'Signing in...') 
                    : (language === 'mm' ? 'ဝင်ရောက်ရန်' : 'Sign In')
                  }
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
                  {language === 'mm' ? 'သို့မဟုတ်' : 'Or'}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-12 hover:bg-primary/10 hover:text-primary transition-all border-border/50 bg-background/50 backdrop-blur-sm font-semibold"
              onClick={handleGuestSignIn}
            >
              <UserCircle className="mr-2 h-5 w-5" />
              {language === 'mm' ? 'ဧည့်သည်အနေဖြင့်ဆက်လက်ရန်' : 'Continue as Guest'}
            </Button>

            <p className="text-center text-muted-foreground text-sm">
              {language === 'mm' ? 'အကောင့်မရှိသေးပါသလား?' : "Don't have an account?"}{' '}
              <Link 
                to="/signup" 
                className="text-primary hover:underline font-semibold transition-colors hover:text-primary/80"
              >
                {language === 'mm' ? 'စာရင်းသွင်းရန်' : 'Sign Up'}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}