import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
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
import { useModal } from '@/contexts/ModalContext';
import { useUpdateWantingList } from '@/hooks/mutations';
import { useWantingList } from '@/hooks/queries/useWantingList';
import { useFormValidation } from '@/hooks/useFormValidation';
import { createWantingListSchema } from '@/lib/validation';
import { FormField } from '@/components/forms';
import type { WantingListUpdateData } from '@/types/wantingList';

export default function EditWantedList() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const seo = seoUtils.getPageSEO('createWantedList'); // Using same SEO as create
  const { t, language } = useLanguage();
  
  // Fetch existing wanting list data
  const { data: wantingListData, isLoading: wantingListLoading } = useWantingList(id || '');
  const wantingList = wantingListData?.data;
  
  // Fetch API data
  const { data: regionsData, isLoading: regionsLoading } = useRegions();
  const { data: townshipsData, isLoading: townshipsLoading } = useTownships();
  const { data: propertyTypesData, isLoading: propertyTypesLoading } = usePropertyTypes();
  
  // Mutation hook
  const updateWantingListMutation = useUpdateWantingList();
  
  // Modal hook
  const { showSuccess, showError } = useModal();
  
  // Form validation
  const { form, errors } = useFormValidation(createWantingListSchema);

  const isLoading = regionsLoading || townshipsLoading || propertyTypesLoading || wantingListLoading;

  const regions = regionsData?.data || [];
  const townships = townshipsData?.data || [];
  const propertyTypes = propertyTypesData?.data || [];

  const watchedRegionId = form.watch('prefer_region_id');
  const availableTownships = townships.filter(township => township.region_id === watchedRegionId);
  
  // Track if form has been initialized to prevent overwriting user changes
  const formInitializedRef = useRef(false);

  // Pre-fill form when wanting list data and all API data are loaded
  useEffect(() => {
    if (wantingList && regions.length > 0 && propertyTypes.length > 0 && townships.length > 0 && !formInitializedRef.current) {
      // Use setTimeout to ensure components are rendered before setting values
      setTimeout(() => {
        // Set basic fields
        if (wantingList.wanted_type) {
          form.setValue('wanted_type', wantingList.wanted_type);
        }
        
        // Set property type - ensure it exists in propertyTypes array
        if (wantingList.property_type?.id) {
          const propertyTypeExists = propertyTypes.some(pt => pt.id === wantingList.property_type.id);
          if (propertyTypeExists) {
            form.setValue('property_type_id', wantingList.property_type.id);
          }
        }
        
        form.setValue('title', wantingList.title || '');
        form.setValue('description', wantingList.description || '');
        
        // Handle location - check both preferred_location (API) and location (type) formats
        const location = (wantingList as any).preferred_location || wantingList.location;
        if (location) {
          let regionId: number | null = null;
          
          // Try to get region ID
          if (location.region?.id) {
            regionId = location.region.id;
          } else if (location.region_en || location.region_mm) {
            // Fallback: find region by name
            const region = regions.find(r => 
              r.name_en === location.region_en || r.name_mm === location.region_mm
            );
            if (region) {
              regionId = region.id;
            }
          }
          
          // Set region if found
          if (regionId) {
            form.setValue('prefer_region_id', regionId);
            // Township will be set by the second useEffect after region is set and availableTownships is ready
          }
        }
        
        form.setValue('min_budget', wantingList.budget?.min_budget || undefined);
        form.setValue('max_budget', wantingList.budget?.max_budget || undefined);
        form.setValue('bedrooms', wantingList.specifications?.bedrooms || undefined);
        form.setValue('bathrooms', wantingList.specifications?.bathrooms || undefined);
        form.setValue('min_area', wantingList.specifications?.min_area || undefined);
        form.setValue('max_area', wantingList.specifications?.max_area || undefined);
        form.setValue('name', wantingList.contact?.name || '');
        form.setValue('phone', wantingList.contact?.phone || '');
        form.setValue('email', wantingList.contact?.email || '');
        form.setValue('additional_requirement', wantingList.additional_requirement || '');
        
        formInitializedRef.current = true;
      }, 100); // Small delay to ensure components are rendered
    }
  }, [wantingList, form, regions, propertyTypes, townships]);

  // Set township after region is set and availableTownships is ready
  useEffect(() => {
    if (wantingList && watchedRegionId && availableTownships.length > 0 && formInitializedRef.current) {
      // Use setTimeout to ensure the region change has been processed
      setTimeout(() => {
        const location = (wantingList as any).preferred_location || wantingList.location;
        if (location) {
          let townshipId: number | null = null;
          
          // Check if we have region ID match and township ID
          if (location.region?.id === watchedRegionId && location.township?.id) {
            // Check if township exists in available townships
            const townshipExists = availableTownships.some(t => t.id === location.township.id);
            if (townshipExists) {
              townshipId = location.township.id;
            }
          } else if (location.region_en || location.region_mm) {
            // Find township by name if using string-based location
            // First verify the region matches
            const regionMatches = regions.some(r => 
              r.id === watchedRegionId && 
              (r.name_en === location.region_en || r.name_mm === location.region_mm)
            );
            
            if (regionMatches && (location.township_en || location.township_mm)) {
              const township = availableTownships.find(t => 
                t.name_en === location.township_en || t.name_mm === location.township_mm
              );
              if (township) {
                townshipId = township.id;
              }
            }
          }
          
          // Set township if found and different from current value
          if (townshipId) {
            const currentTownshipId = form.getValues('prefer_township_id');
            if (currentTownshipId !== townshipId) {
              form.setValue('prefer_township_id', townshipId);
            }
          }
        }
      }, 50); // Small delay to ensure region change is processed
    }
  }, [watchedRegionId, availableTownships, wantingList, form, regions]);

  const onSubmit = (data: any) => {
    if (!id) return;
    
    // Prepare data for API
    const updateData: WantingListUpdateData = {
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
    };

    updateWantingListMutation.mutate(
      { slug: id, data: updateData },
      {
        onSuccess: (response) => {
          showSuccess(
            t('editWantedList.successMessage'),
            t('editWantedList.successTitle')
          );
          // Navigate to the detail page of the updated listing
          setTimeout(() => {
            navigate(`/my-wanted-listings/detail/${response.data.slug}`);
          }, 2000);
        },
        onError: (error: any) => {
          console.error('Update wanting list failed:', error);
          const errorMessage = error?.response?.data?.message || error?.message || t('editWantedList.errorMessage');
          showError(errorMessage, t('editWantedList.errorTitle'));
        },
      }
    );
  };

  const handleRegionChange = (value: string) => {
    form.setValue('prefer_region_id', parseInt(value));
    form.setValue('prefer_township_id', 0); // Reset township when region changes
  };

  return (
    <>
      <SEOHead seo={seo} path={`/my-wanted-listings/edit/${id}`} />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                {t('editWantedList.title')}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('createWantedList.description')}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-primary hover:bg-primary/10"
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
                      value={form.watch('wanted_type') || ''} 
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
                      value={form.watch('property_type_id')?.toString() || ''} 
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
                      value={form.watch('prefer_region_id')?.toString() || ''} 
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
                      value={form.watch('prefer_township_id')?.toString() || ''} 
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
                    disabled={updateWantingListMutation.isPending}
                    className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105"
                  >
                    {updateWantingListMutation.isPending ? t('editWantedList.updating') : t('editWantedList.updateListing')}
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

