import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, User, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { useRegions, useTownships } from '@/hooks/queries/useLocations';
import { usePropertyTypes } from '@/hooks/queries/usePropertyTypes';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCreateWantingList } from '@/hooks/mutations';
import { useFormValidation } from '@/hooks/useFormValidation';
import { createWantingListSchema } from '@/lib/validation';
import { FormField } from '@/components/forms';
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
  
  // Form validation
  const { form, errors } = useFormValidation(createWantingListSchema);
  
  const isLoading = regionsLoading || townshipsLoading || propertyTypesLoading;

  const regions = regionsData?.data || [];
  const townships = townshipsData?.data || [];
  const propertyTypes = propertyTypesData?.data || [];

  const watchedRegionId = form.watch('prefer_region_id');
  const availableTownships = townships.filter(township => township.region_id === watchedRegionId);

  const onSubmit = (data: any) => {
    // Prepare data for API
    const createData: WantingListCreateData = {
      wanted_type: data.wanted_type,
      property_type_id: data.property_type_id,
      title: data.title,
      prefer_region_id: data.prefer_region_id,
      prefer_township_id: data.prefer_township_id,
      name: data.name,
      phone: data.phone,
      description: data.description || undefined,
      min_budget: data.min_budget || undefined,
      max_budget: data.max_budget || undefined,
      bedrooms: data.bedrooms || undefined,
      bathrooms: data.bathrooms || undefined,
      min_area: data.min_area || undefined,
      max_area: data.max_area || undefined,
      additional_requirement: data.additional_requirement || undefined,
      email: data.email || undefined,
      status: 'published', // Default to published
    };

    createWantingListMutation.mutate(createData, {
      onSuccess: () => {
        navigate('/my-wanted-listings/list');
      },
    });
  };

  const handleRegionChange = (value: string) => {
    form.setValue('prefer_region_id', parseInt(value));
    form.setValue('prefer_township_id', 0); // Reset township when region changes
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <FormField 
                    name="wanted_type" 
                    label={t('createWantedList.iAmA')} 
                    error={errors.wanted_type} 
                    required
                  >
                    <Select 
                      value={form.watch('wanted_type')} 
                      onValueChange={(value) => form.setValue('wanted_type', value as 'buyer' | 'renter')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('createWantedList.selectType')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyer">{t('myWantedList.buyer')}</SelectItem>
                        <SelectItem value="renter">{t('myWantedList.renter')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField 
                    name="property_type_id" 
                    label={t('createWantedList.propertyType')} 
                    error={errors.property_type_id} 
                    required
                  >
                    <Select 
                      value={form.watch('property_type_id')?.toString()} 
                      onValueChange={(value) => form.setValue('property_type_id', parseInt(value))}
                    >
                      <SelectTrigger>
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
                  </FormField>
                </div>

                <FormField 
                  name="title" 
                  label={t('createWantedList.titleLabel')} 
                  error={errors.title} 
                  required
                >
                  <Input
                    {...form.register('title')}
                    placeholder={t('createWantedList.titlePlaceholder')}
                  />
                </FormField>

                <FormField 
                  name="description" 
                  label={t('createWantedList.descriptionLabel')} 
                  error={errors.description}
                >
                  <Textarea
                    {...form.register('description')}
                    placeholder={t('createWantedList.descriptionPlaceholder')}
                    rows={4}
                  />
                </FormField>
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
                  <FormField 
                    name="prefer_region_id" 
                    label={t('createWantedList.region')} 
                    error={errors.prefer_region_id} 
                    required
                  >
                    <Select 
                      value={form.watch('prefer_region_id')?.toString()} 
                      onValueChange={handleRegionChange}
                    >
                      <SelectTrigger>
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
                  </FormField>

                  <FormField 
                    name="prefer_township_id" 
                    label={t('createWantedList.township')} 
                    error={errors.prefer_township_id} 
                    required
                  >
                    <Select 
                      value={form.watch('prefer_township_id')?.toString()} 
                      onValueChange={(value) => form.setValue('prefer_township_id', parseInt(value))}
                      disabled={!watchedRegionId}
                    >
                      <SelectTrigger>
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
                  </FormField>
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
                    <FormField 
                      name="min_budget" 
                      label={t('createWantedList.minBudget')} 
                      error={errors.min_budget}
                    >
                      <Input
                        {...form.register('min_budget')}
                        type="number"
                        placeholder="e.g., 50000000"
                      />
                    </FormField>

                    <FormField 
                      name="max_budget" 
                      label={t('createWantedList.maxBudget')} 
                      error={errors.max_budget}
                    >
                      <Input
                        {...form.register('max_budget')}
                        type="number"
                        placeholder="e.g., 80000000"
                      />
                    </FormField>
                  </div>
                </div>

                {/* Property Specifications Section */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField 
                      name="bedrooms" 
                      label={t('createWantedList.bedrooms')} 
                      error={errors.bedrooms}
                    >
                      <Select 
                        value={form.watch('bedrooms')?.toString()} 
                        onValueChange={(value) => form.setValue('bedrooms', parseInt(value))}
                      >
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
                    </FormField>

                    <FormField 
                      name="bathrooms" 
                      label={t('createWantedList.bathrooms')} 
                      error={errors.bathrooms}
                    >
                      <Select 
                        value={form.watch('bathrooms')?.toString()} 
                        onValueChange={(value) => form.setValue('bathrooms', parseInt(value))}
                      >
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
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField 
                      name="min_area" 
                      label={t('createWantedList.minArea')} 
                      error={errors.min_area}
                    >
                      <Input
                        {...form.register('min_area')}
                        type="number"
                        placeholder="e.g., 1200"
                      />
                    </FormField>

                    <FormField 
                      name="max_area" 
                      label={t('createWantedList.maxArea')} 
                      error={errors.max_area}
                    >
                      <Input
                        {...form.register('max_area')}
                        type="number"
                        placeholder="e.g., 2000"
                      />
                    </FormField>
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
                  <FormField 
                    name="name" 
                    label={t('createWantedList.fullName')} 
                    error={errors.name} 
                    required
                  >
                    <Input
                      {...form.register('name')}
                      placeholder="Your full name"
                    />
                  </FormField>

                  <FormField 
                    name="phone" 
                    label={t('createWantedList.phoneNumber')} 
                    error={errors.phone} 
                    required
                  >
                    <Input
                      {...form.register('phone')}
                      placeholder="e.g., 09123456789"
                    />
                  </FormField>

                  <FormField 
                    name="email" 
                    label={t('createWantedList.emailAddress')} 
                    error={errors.email}
                  >
                    <Input
                      {...form.register('email')}
                      type="email"
                      placeholder="your.email@example.com"
                    />
                  </FormField>
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
                <FormField 
                  name="additional_requirement" 
                  label={t('createWantedList.specialRequirements')} 
                  error={errors.additional_requirement}
                >
                  <Textarea
                    {...form.register('additional_requirement')}
                    placeholder={t('createWantedList.specialRequirementsPlaceholder')}
                    rows={3}
                  />
                </FormField>
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
