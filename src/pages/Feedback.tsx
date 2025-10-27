import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageSquare, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SEOHead } from '@/components/seo/SEOHead';
import { useFeedbackForm } from '@/hooks/mutations/useFeedback';
import { useModal } from '@/contexts/ModalContext';
import type { FeedbackFormData } from '@/types/feedback';

interface FeedbackForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export function Feedback() {
  const { t, language } = useLanguage();
  const { mutate: submitForm, isPending } = useFeedbackForm();
  const { showSuccess, showError } = useModal();
  const [formData, setFormData] = useState<FeedbackForm>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<FeedbackForm>>({});

  const handleInputChange = (field: keyof FeedbackForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FeedbackForm> = {};

    if (!formData.name.trim()) {
      newErrors.name = language === 'mm' ? 'နာမည်ထည့်ရန်လိုအပ်ပါသည်' : 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = language === 'mm' ? 'အီးမေးလ်ထည့်ရန်လိုအပ်ပါသည်' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = language === 'mm' ? 'အီးမေးလ်ပုံစံမမှန်ပါ' : 'Invalid email format';
    }

    if (!formData.message.trim()) {
      newErrors.message = language === 'mm' ? 'အကြံပြုချက်ထည့်ရန်လိုအပ်ပါသည်' : 'Feedback message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData: FeedbackFormData = {
      user_name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      feedback: formData.message
    };

    submitForm(submitData, {
      onSuccess: () => {
        showSuccess(
          t('feedback.success.message'),
          t('feedback.success.title')
        );
        resetForm();
      },
      onError: (error: any) => {
        console.error('Feedback submission failed:', error);
        const errorMessage = error?.response?.data?.message || error?.message || t('feedback.error.message');
        showError(errorMessage, t('feedback.error.title'));
      }
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
    setErrors({});
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
      <SEOHead
        seo={{
          title: t('feedback.seo.title'),
          description: t('feedback.seo.description'),
          keywords: t('feedback.seo.keywords'),
          image: '/jade.png',
          type: 'website'
        }}
        path="/feedback"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-[#4a9b82] mb-4">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
            {t('services.applyFeedback')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('services.applyFeedbackDesc')}
          </p>
        </div>

        {/* Feedback Form */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>{t('feedback.form.title')}</CardTitle>
            {/* <CardDescription>
              {t('feedback.form.description')}
            </CardDescription> */}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-muted-foreground">
                    {t('feedback.form.name')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder={t('feedback.form.namePlaceholder')}
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-muted-foreground">
                    {t('feedback.form.email')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('feedback.form.emailPlaceholder')}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-muted-foreground">
                  {t('feedback.form.phone')}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t('feedback.form.phonePlaceholder')}
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Feedback Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-muted-foreground">
                  {t('feedback.form.message')} <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder={t('feedback.form.messagePlaceholder')}
                  rows={6}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className={errors.message ? "border-red-500" : ""}
                />
                {errors.message && (
                  <p className="text-sm text-red-500">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t('feedback.form.submitting')}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {t('feedback.form.submit')}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card className="glass border-border/50 mt-6 p-6 text-center">
          <p className="text-muted-foreground">
            {t('feedback.info.message')}
          </p>
        </Card>
      </div>
    </div>
  );
}