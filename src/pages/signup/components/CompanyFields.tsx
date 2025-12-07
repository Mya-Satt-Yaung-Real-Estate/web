import { useState, useEffect } from 'react';
import { Mail, Building2, MapPin, FileText, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/stores/authStore';
import { useRegisterCompany } from '@/hooks/mutations/useRegister';
import { useRegions, useTownships } from '@/hooks/queries/useLocations';
import { useCompanyTypes } from '@/hooks/queries/useCompanyTypes';
import type { RegisterCompanyRequest } from '@/types/auth';

interface CompanyFieldsProps {
  phone: string;
  onSuccess: () => void;
}

export function CompanyFields({ phone, onSuccess }: CompanyFieldsProps) {
  const { t, language } = useLanguage();
  const { setToken, checkAuth } = useAuthStore();
  const { mutate: register, isPending } = useRegisterCompany();
  
  // Fetch lookup data
  const { data: regionsResp } = useRegions();
  const { data: townshipsResp } = useTownships();
  const { data: companyTypesResp } = useCompanyTypes();
  
  const regions = regionsResp?.data || [];
  const townships = townshipsResp?.data || [];
  const companyTypes = companyTypesResp?.data?.data || [];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company_name: '',
    company_type_id: '',
    address: '',
    region_id: '',
    township_id: '',
    description: '',
    website: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter townships based on selected region
  const availableTownships = formData.region_id
    ? townships.filter((ts: any) => Number(ts.region_id) === Number(formData.region_id))
    : [];

  // Reset township when region changes
  useEffect(() => {
    if (formData.region_id) {
      setFormData(prev => ({ ...prev, township_id: '' }));
    }
  }, [formData.region_id]);

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (field: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

    if (!formData.company_name.trim()) {
      newErrors.company_name = t('signup.register.companyNameRequired') || 'Company name is required';
    }

    if (!formData.company_type_id) {
      newErrors.company_type_id = t('signup.register.companyTypeRequired') || 'Company type is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = t('signup.register.addressRequired') || 'Address is required';
    }

    if (!formData.region_id) {
      newErrors.region_id = t('signup.register.regionRequired') || 'Region is required';
    }

    if (!formData.township_id) {
      newErrors.township_id = t('signup.register.townshipRequired') || 'Township is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const payload: RegisterCompanyRequest = {
      name: formData.name.trim(),
      email: formData.email.trim() || undefined,
      phone: phone.startsWith('09') ? phone : `09${phone}`,
      password: '', // Password not required for OTP-based registration
      password_confirmation: '', // Password confirmation not required
      company_name: formData.company_name.trim(),
      company_type_id: Number(formData.company_type_id),
      address: formData.address.trim(),
      region_id: Number(formData.region_id),
      township_id: Number(formData.township_id),
      description: formData.description.trim() || undefined,
      website: formData.website.trim() || undefined,
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
        <Label htmlFor="company_name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          {t('signup.register.companyName') || 'Company Name'}
        </Label>
        <Input
          id="company_name"
          type="text"
          value={formData.company_name}
          onChange={handleChange('company_name')}
          className={errors.company_name ? 'border-red-500' : ''}
          disabled={isPending}
          placeholder={t('signup.register.companyNamePlaceholder') || 'Enter company name'}
        />
        {errors.company_name && (
          <p className="text-sm text-red-600">{errors.company_name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="company_type_id" className="text-sm font-medium text-gray-700">
          {t('signup.register.companyType') || 'Company Type'}
        </Label>
        <Select
          value={formData.company_type_id}
          onValueChange={handleSelectChange('company_type_id')}
          disabled={isPending}
        >
          <SelectTrigger className={errors.company_type_id ? 'border-red-500' : ''}>
            <SelectValue placeholder={t('signup.register.selectCompanyType') || 'Select company type'} />
          </SelectTrigger>
          <SelectContent>
            {companyTypes.map((type: any) => (
              <SelectItem key={type.id} value={type.id.toString()}>
                {language === 'mm' ? type.name_mm : type.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.company_type_id && (
          <p className="text-sm text-red-600">{errors.company_type_id}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {t('signup.register.address') || 'Address'}
        </Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={handleChange('address')}
          className={errors.address ? 'border-red-500' : ''}
          disabled={isPending}
          placeholder={t('signup.register.addressPlaceholder') || 'Enter business address'}
          rows={3}
        />
        {errors.address && (
          <p className="text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="region_id" className="text-sm font-medium text-gray-700">
            {t('signup.register.region') || 'Region'}
          </Label>
          <Select
            value={formData.region_id}
            onValueChange={handleSelectChange('region_id')}
            disabled={isPending}
          >
            <SelectTrigger className={errors.region_id ? 'border-red-500' : ''}>
              <SelectValue placeholder={t('signup.register.selectRegion') || 'Select region'} />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region: any) => (
                <SelectItem key={region.id} value={region.id.toString()}>
                  {language === 'mm' ? region.name_mm : region.name_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.region_id && (
            <p className="text-sm text-red-600">{errors.region_id}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="township_id" className="text-sm font-medium text-gray-700">
            {t('signup.register.township') || 'Township'}
          </Label>
          <Select
            value={formData.township_id}
            onValueChange={handleSelectChange('township_id')}
            disabled={isPending || !formData.region_id}
          >
            <SelectTrigger className={errors.township_id ? 'border-red-500' : ''}>
              <SelectValue placeholder={t('signup.register.selectTownship') || 'Select township'} />
            </SelectTrigger>
            <SelectContent>
              {availableTownships.map((township: any) => (
                <SelectItem key={township.id} value={township.id.toString()}>
                  {language === 'mm' ? township.name_mm : township.name_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.township_id && (
            <p className="text-sm text-red-600">{errors.township_id}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          {t('signup.register.description') || 'Description'} ({t('common.optional') || 'Optional'})
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={handleChange('description')}
          disabled={isPending}
          placeholder={t('signup.register.descriptionPlaceholder') || 'Enter company description'}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website" className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Globe className="h-4 w-4" />
          {t('signup.register.website') || 'Website'} ({t('common.optional') || 'Optional'})
        </Label>
        <Input
          id="website"
          type="url"
          value={formData.website}
          onChange={handleChange('website')}
          disabled={isPending}
          placeholder={t('signup.register.websitePlaceholder') || 'https://example.com'}
        />
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

