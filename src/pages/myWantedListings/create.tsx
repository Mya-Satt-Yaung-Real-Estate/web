import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, User, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { useRegions, useTownships } from '@/hooks/queries/useLocations';
import { usePropertyTypes } from '@/hooks/queries/usePropertyTypes';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCreateWantingList } from '@/hooks/mutations';
import type { WantingListCreateData } from '@/types/wantingList';

export default function CreateWantedList() {
  const navigate = useNavigate();
  const seo = seoUtils.getPageSEO('createWantedList');
  const { t, language } = useLanguage();
  
  // Fetch API data
  const { data: regionsData, isLoading: regionsLoading } = useRegions();
  const { data: townshipsData, isLoading: townshipsLoading } = useTownships();
  const { data: propertyTypesData, isLoading: propertyTypesLoading } = usePropertyTypes();
  
  // Mutation hook
  const createWantingListMutation = useCreateWantingList();
  
  const isLoading = regionsLoading || townshipsLoading || propertyTypesLoading;

  const regions = regionsData?.data || [];
  const townships = townshipsData?.data || [];
  const propertyTypes = propertyTypesData?.data || [];

  const [formData, setFormData] = useState({
    wanted_type: '',
    property_type_id: '',
    title: '',
    prefer_region_id: '',
    prefer_township_id: '',
    name: '',
    phone: '',
    description: '',
    min_budget: '',
    max_budget: '',
    bedrooms: '',
    bathrooms: '',
    min_area: '',
    max_area: '',
    additional_requirement: '',
    email: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableTownships = townships.filter(township => township.region_id === parseInt(formData.prefer_region_id));

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.wanted_type) {
      newErrors.wanted_type = t('validation.required');
    }
    if (!formData.property_type_id) {
      newErrors.property_type_id = t('validation.required');
    }
    if (!formData.title.trim()) {
      newErrors.title = t('validation.required');
    }
    if (!formData.prefer_region_id) {
      newErrors.prefer_region_id = t('validation.required');
    }
    if (!formData.prefer_township_id) {
      newErrors.prefer_township_id = t('validation.required');
    }
    if (!formData.name.trim()) {
      newErrors.name = t('validation.required');
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t('validation.required');
    }

    // Budget validation
    if (formData.min_budget && formData.max_budget) {
      const minBudget = parseInt(formData.min_budget);
      const maxBudget = parseInt(formData.max_budget);
      if (minBudget > maxBudget) {
        newErrors.max_budget = t('validation.budgetRange');
      }
    }

    // Area validation
    if (formData.min_area && formData.max_area) {
      const minArea = parseInt(formData.min_area);
      const maxArea = parseInt(formData.max_area);
      if (minArea > maxArea) {
        newErrors.max_area = t('validation.areaRange');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Reset township when region changes
    if (field === 'prefer_region_id') {
      setFormData(prev => ({ ...prev, prefer_township_id: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Prepare data for API
    const createData: WantingListCreateData = {
      wanted_type: formData.wanted_type as 'buyer' | 'renter',
      property_type_id: parseInt(formData.property_type_id),
      title: formData.title.trim(),
      prefer_region_id: parseInt(formData.prefer_region_id),
      prefer_township_id: parseInt(formData.prefer_township_id),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      description: formData.description.trim() || undefined,
      min_budget: formData.min_budget ? parseInt(formData.min_budget) : undefined,
      max_budget: formData.max_budget ? parseInt(formData.max_budget) : undefined,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
      min_area: formData.min_area ? parseInt(formData.min_area) : undefined,
      max_area: formData.max_area ? parseInt(formData.max_area) : undefined,
      additional_requirement: formData.additional_requirement.trim() || undefined,
      email: formData.email.trim() || undefined,
      status: 'published', // Default to published
    };

    createWantingListMutation.mutate(createData, {
      onSuccess: () => {
        navigate('/my-wanted-listings/list');
      },
    });
  };

  return (
    <>
      <SEOHead seo={seo} path="/my-wanted-listings/create" />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                {t('createWantedList.title')}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('createWantedList.description')}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('createWantedList.back')}
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">{t('createWantedList.loading')}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  {t('createWantedList.basicInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wanted_type">{t('createWantedList.iAmA')} <span className="text-red-500">*</span></Label>
                    <Select value={formData.wanted_type} onValueChange={(value) => handleInputChange('wanted_type', value)}>
                      <SelectTrigger className={errors.wanted_type ? 'border-red-500' : ''}>
                        <SelectValue placeholder={t('createWantedList.selectType')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyer">{t('myWantedList.buyer')}</SelectItem>
                        <SelectItem value="renter">{t('myWantedList.renter')}</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.wanted_type && (
                      <p className="text-sm text-red-500">{errors.wanted_type}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="property_type_id">{t('createWantedList.propertyType')} <span className="text-red-500">*</span></Label>
                    <Select value={formData.property_type_id} onValueChange={(value) => handleInputChange('property_type_id', value)}>
                      <SelectTrigger className={errors.property_type_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder={t('createWantedList.selectPropertyType')} />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type[`name_${language}`]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.property_type_id && (
                      <p className="text-sm text-red-500">{errors.property_type_id}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="title">{t('createWantedList.titleLabel')} <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    placeholder={t('createWantedList.titlePlaceholder')}
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">{t('createWantedList.descriptionLabel')}</Label>
                  <Textarea
                    id="description"
                    placeholder={t('createWantedList.descriptionPlaceholder')}
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferred Location Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  {t('createWantedList.preferredLocation')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prefer_region_id">{t('createWantedList.region')} <span className="text-red-500">*</span></Label>
                    <Select value={formData.prefer_region_id} onValueChange={(value) => handleInputChange('prefer_region_id', value)}>
                      <SelectTrigger className={errors.prefer_region_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder={t('createWantedList.selectRegion')} />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region.id} value={region.id.toString()}>
                            {region[`name_${language}`]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.prefer_region_id && (
                      <p className="text-sm text-red-500">{errors.prefer_region_id}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prefer_township_id">{t('createWantedList.township')} <span className="text-red-500">*</span></Label>
                    <Select 
                      value={formData.prefer_township_id} 
                      onValueChange={(value) => handleInputChange('prefer_township_id', value)}
                      disabled={!formData.prefer_region_id}
                    >
                      <SelectTrigger className={errors.prefer_township_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder={t('createWantedList.selectTownship')} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTownships.map((township) => (
                          <SelectItem key={township.id} value={township.id.toString()}>
                            {township[`name_${language}`]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.prefer_township_id && (
                      <p className="text-sm text-red-500">{errors.prefer_township_id}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget & Property Specifications Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  {t('createWantedList.budgetPropertySpecs')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Budget Range Section */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min_budget">{t('createWantedList.minBudget')}</Label>
                      <Input
                        id="min_budget"
                        type="number"
                        placeholder="e.g., 50000000"
                        value={formData.min_budget}
                        onChange={(e) => handleInputChange('min_budget', e.target.value)}
                        className={errors.min_budget ? 'border-red-500' : ''}
                      />
                      {errors.min_budget && (
                        <p className="text-sm text-red-500">{errors.min_budget}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max_budget">{t('createWantedList.maxBudget')}</Label>
                      <Input
                        id="max_budget"
                        type="number"
                        placeholder="e.g., 80000000"
                        value={formData.max_budget}
                        onChange={(e) => handleInputChange('max_budget', e.target.value)}
                        className={errors.max_budget ? 'border-red-500' : ''}
                      />
                      {errors.max_budget && (
                        <p className="text-sm text-red-500">{errors.max_budget}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Property Specifications Section */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">{t('createWantedList.bedrooms')}</Label>
                      <Select value={formData.bedrooms} onValueChange={(value) => handleInputChange('bedrooms', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('createWantedList.any')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">{t('createWantedList.any')}</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">{t('createWantedList.bathrooms')}</Label>
                      <Select value={formData.bathrooms} onValueChange={(value) => handleInputChange('bathrooms', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('createWantedList.any')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">{t('createWantedList.any')}</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min_area">{t('createWantedList.minArea')}</Label>
                      <Input
                        id="min_area"
                        type="number"
                        placeholder="e.g., 1200"
                        value={formData.min_area}
                        onChange={(e) => handleInputChange('min_area', e.target.value)}
                        className={errors.min_area ? 'border-red-500' : ''}
                      />
                      {errors.min_area && (
                        <p className="text-sm text-red-500">{errors.min_area}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max_area">{t('createWantedList.maxArea')}</Label>
                      <Input
                        id="max_area"
                        type="number"
                        placeholder="e.g., 2000"
                        value={formData.max_area}
                        onChange={(e) => handleInputChange('max_area', e.target.value)}
                        className={errors.max_area ? 'border-red-500' : ''}
                      />
                      {errors.max_area && (
                        <p className="text-sm text-red-500">{errors.max_area}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Phone className="h-5 w-5 text-primary" />
                  {t('createWantedList.contactInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('createWantedList.fullName')} <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('createWantedList.phoneNumber')} <span className="text-red-500">*</span></Label>
                    <Input
                      id="phone"
                      placeholder="e.g., 09123456789"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('createWantedList.emailAddress')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Requirements Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  {t('createWantedList.additionalRequirements')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="additional_requirement">{t('createWantedList.specialRequirements')}</Label>
                  <Textarea
                    id="additional_requirement"
                    placeholder={t('createWantedList.specialRequirementsPlaceholder')}
                    rows={3}
                    value={formData.additional_requirement}
                    onChange={(e) => handleInputChange('additional_requirement', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Buttons Card */}
            <Card className="shadow-lg">
              <CardContent className="pt-6">
                <div className="flex justify-end gap-4">
                  <Button
                    type="submit"
                    disabled={createWantingListMutation.isPending}
                    className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105"
                  >
                    {createWantingListMutation.isPending ? t('createWantedList.creating') : t('createWantedList.createListing')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    {t('createWantedList.cancel')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
          )}
        </div>
      </div>
    </>
  );
}
