import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MapPin, Clock, Send, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useContactForm } from '@/hooks/mutations/useContact';
import { useModal } from '@/contexts/ModalContext';
import { SEOHead } from '@/components/seo/SEOHead';
import type { ContactFormData } from '@/types/contact';

const contactCategories = [
  'General Inquiry',
  'Property Listing',
  'Technical Support',
  'Partnership',
  'Complaint',
  'Suggestions'
];

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    details: ['+959763335120'],
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['info@jadeproperty.com', 'support@jadeproperty.com'],
  },
  {
    icon: MapPin,
    title: 'Office Address',
    details: ['122/B, Min Ye Kyaw Swar Rd, Yangon, Myanmar (Burma)'],
  },
  {
    icon: Clock,
    title: 'Office Hours',
    details: ['Mon - Fri: 9:00 AM - 5:00 PM'],
  },
];

export default function Contact() {
  const { language, t } = useLanguage();
  const { mutate: submitForm, isPending } = useContactForm();
  const { showSuccess, showError } = useModal();
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: ''
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [apiErrors, setApiErrors] = useState<{[key: string]: string[]}>({});

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (apiErrors[field]) {
      setApiErrors(prev => ({ ...prev, [field]: [] }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = language === 'mm' ? 'နာမည်ထည့်ရန်လိုအပ်ပါသည်' : 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = language === 'mm' ? 'အီးမေးလ်ထည့်ရန်လိုအပ်ပါသည်' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = language === 'mm' ? 'အီးမေးလ်ပုံစံမမှန်ပါ' : 'Invalid email format';
    }

    if (!formData.category) {
      newErrors.category = language === 'mm' ? 'အမျိုးအစားရွေးရန်လိုအပ်ပါသည်' : 'Category is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = language === 'mm' ? 'မက်ဆေ့ဂ်ထည့်ရန်လိုအပ်ပါသည်' : 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous API errors
    setApiErrors({});
    
    console.log('Form submitted, validating...', formData);
    
    if (!validateForm()) {
      console.log('Validation failed', errors);
      return;
    }

    const submitData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      subject: formData.category, // Use category as subject for API
      category: formData.category,
      message: formData.message
    };

    console.log('Submitting data:', submitData);
    submitForm(submitData, {
      onSuccess: () => {
        showSuccess(
          t('contact.successMessage'),
          t('contact.successTitle')
        );
        resetForm();
      },
      onError: (error: any) => {
        console.log('API Error:', error);
        console.log('Error response:', error?.response);
        console.log('Error data:', error?.response?.data);
        
        // Show error modal
        const errorMessage = error?.response?.data?.message || error?.message || t('contact.errorMessage');
        showError(errorMessage, t('contact.errorTitle'));
        
        // Set field-specific errors
        if (error?.response?.data?.errors) {
          setApiErrors(error.response.data.errors);
        }
      }
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      category: '',
      message: ''
    });
    setErrors({});
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
      <SEOHead 
        seo={{
          title: "Contact Us",
          description: "Get in touch with our team",
          keywords: "contact, support, inquiry, help",
          image: "/jade.png",
          type: "website"
        }}
        path="/contact"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
            {t('contact.title')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="glass border-border/50 hover:border-primary/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-[#4a9b82] flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="mb-2">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Map */}
            <Card className="glass border-border/50 overflow-hidden">
              <div className="h-64 w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3818.017785832165!2d96.0737902!3d16.875014699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30c195003798c353%3A0xb2e33dfaaa7e4533!2sMyaSattYaung(RealEstate)!5e0!3m2!1sen!2sth!4v1761475866151!5m2!1sen!2sth"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="MyaSattYaung Real Estate Location"
                  className="rounded-lg"
                />
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-muted-foreground">{t('contact.nameLabel')}</label>
                    <Input 
                      placeholder={t('contact.namePlaceholder')} 
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={errors.name || apiErrors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.name}
                      </p>
                    )}
                    {apiErrors.name && apiErrors.name.map((error, index) => (
                      <p key={index} className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                      </p>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className="text-muted-foreground">{t('contact.emailLabel')}</label>
                    <Input 
                      type="email" 
                      placeholder={t('contact.emailPlaceholder')} 
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email || apiErrors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.email}
                      </p>
                    )}
                    {apiErrors.email && apiErrors.email.map((error, index) => (
                      <p key={index} className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground">{t('contact.phoneLabel')}</label>
                  <Input 
                    type="tel" 
                    placeholder={t('contact.phonePlaceholder')} 
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={apiErrors.phone ? 'border-red-500' : ''}
                  />
                  {apiErrors.phone && apiErrors.phone.map((error, index) => (
                    <p key={index} className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </p>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground">{t('contact.categoryLabel')}</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger className={errors.category || apiErrors.category ? 'border-red-500' : ''}>
                      <SelectValue placeholder={t('contact.categoryPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {contactCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.category}
                    </p>
                  )}
                  {apiErrors.category && apiErrors.category.map((error, index) => (
                    <p key={index} className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </p>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-muted-foreground">{t('contact.messageLabel')}</label>
                  <Textarea
                    placeholder={t('contact.messagePlaceholder')}
                    rows={6}
                    value={formData.message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('message', e.target.value)}
                    className={errors.message || apiErrors.message ? 'border-red-500' : ''}
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.message}
                    </p>
                  )}
                  {apiErrors.message && apiErrors.message.map((error, index) => (
                    <p key={index} className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </p>
                  ))}
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105"
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('forms.sending')}
                    </div>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {t('contact.submitButton')}
                    </>
                  )}
                </Button>

              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
