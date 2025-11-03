import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Home, Phone, Image, CheckCircle, CheckCircle2, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { useModal } from '@/contexts/ModalContext';
import { useRegions, useTownships } from '@/hooks/queries/useLocations';
import { usePropertyTypes } from '@/hooks/queries/usePropertyTypes';
import { useListingTypes } from '@/hooks/queries/useProperties';
import { useMyProperty } from '@/hooks/queries/useProperties';
import { useUpdateMyProperty } from '@/hooks/mutations/usePropertyMutations';
import { MediaUpload } from '@/components/MediaUpload';
import { MapLocationPicker } from '@/components/MapLocationPicker';
import { pointSettingsApi } from '@/services/api/pointSettings';
import { useFormValidation } from '@/hooks/useFormValidation';
import { createPropertySchema } from '@/lib/validation/property';
import { FormField } from '@/components/forms';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditProperty() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const seo = seoUtils.getPageSEO('editProperty');
  const { t, language } = useLanguage();
  const { showSuccess, showError } = useModal();

  // Fetch property data - will refetch on mount due to refetchOnMount: 'always' in useMyProperty hook
  const { data: propertyData, isLoading: propertyLoading, error: propertyError } = useMyProperty(slug || '');

  // Lookups
  const { data: regionsResp } = useRegions();
  const { data: townshipsResp } = useTownships();
  const { data: propertyTypesResp } = usePropertyTypes();
  const { data: listingTypesResp } = useListingTypes();
  const regions = regionsResp?.data || [];
  const townships = townshipsResp?.data || [];
  const propertyTypes = propertyTypesResp?.data || [];
  const listingTypes = listingTypesResp?.data || [];

  // Form validation
  const { form, errors } = useFormValidation(createPropertySchema);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(['']);
  const [phoneErrors, setPhoneErrors] = useState<string[]>(['']);

  const [mediaIds, setMediaIds] = useState<number[]>([]);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [initialMediaFiles, setInitialMediaFiles] = useState<Array<{
    id: number;
    url: string;
    filename: string;
    type: 'image' | 'video';
    size?: number;
  }>>([]);
  
  // Confirmation dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pointSettings, setPointSettings] = useState<any>(null);
  const [loadingPointSettings, setLoadingPointSettings] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalStatus, setOriginalStatus] = useState<'draft' | 'published' | null>(null);

  // Mutation hook
  const updatePropertyMutation = useUpdateMyProperty();

  // Track if form has been initialized to prevent overwriting user changes
  const formInitializedRef = useRef(false);

  const property = propertyData?.data?.data;

  // Check if property is published and approved - if so, restrict editing
  const isPublishedAndApproved = property?.status === 'published' && property?.verification_status === 'approved';
  
  // Check if property is sold or rented - if so, disable all editing
  const isSoldOrRented = property?.status === 'sold' || property?.status === 'rented';
  
  // Combined check for restricted editing
  const isEditingRestricted = isPublishedAndApproved || isSoldOrRented;

  // Reset form initialization when slug changes (navigating to different property)
  useEffect(() => {
    formInitializedRef.current = false;
  }, [slug]);

  // Pre-fill form when property data is loaded
  useEffect(() => {
    // Check if all required data is available
    const hasProperty = !!property;
    const hasLookupData = regions.length > 0 && townships.length > 0 && propertyTypes.length > 0 && listingTypes.length > 0;
    const shouldInitialize = hasProperty && !formInitializedRef.current && hasLookupData;
    const isLoading = propertyLoading || !propertyData;
    
    // Don't initialize if still loading
    if (isLoading) {
      console.log('Waiting for property data to load...');
      return;
    }
    
    if (shouldInitialize) {
      console.log('Initializing form with property data:', property);
      console.log('Lookup data available - regions:', regions.length, 'townships:', townships.length, 'propertyTypes:', propertyTypes.length, 'listingTypes:', listingTypes.length);
      
      // Use setTimeout to ensure React has processed all state updates before setting form values
      const initTimer = setTimeout(() => {
        // Basic Information - set as numbers for form validation, but Select will convert to string
        const propertyTypeId = property.property_type?.id || (property as any).property_type_id;
        const listingTypeId = property.listing_type?.id || (property as any).listing_type_id;
        const propertyCondition = property.property_condition?.value || (property as any).property_condition;
        
        if (propertyTypeId) {
          console.log('Setting property_type_id:', propertyTypeId);
          form.setValue('property_type_id', Number(propertyTypeId), { shouldValidate: false, shouldDirty: false });
        }
        if (listingTypeId) {
          console.log('Setting listing_type_id:', listingTypeId);
          form.setValue('listing_type_id', Number(listingTypeId), { shouldValidate: false, shouldDirty: false });
        }
        if (propertyCondition) {
          console.log('Setting property_condition:', propertyCondition);
          form.setValue('property_condition', propertyCondition, { shouldValidate: false, shouldDirty: false });
        }
        form.setValue('title_en', property.title_en || '', { shouldValidate: false });
        form.setValue('title_mm', property.title_mm || '', { shouldValidate: false });
        form.setValue('description', property.description || '', { shouldValidate: false });

        // Location - set region first, township will be set after region and townships are ready
        const regionId = property.location?.region?.id || (property as any).region_id;
        if (regionId) {
          console.log('Setting region_id:', regionId);
          form.setValue('region_id', Number(regionId), { shouldValidate: false, shouldDirty: false });
          
          // Set township after a delay to ensure region is processed and townships are filtered
          setTimeout(() => {
            const townshipId = property.location?.township?.id || (property as any).township_id;
            if (townshipId) {
              // Filter townships for the selected region
              const filteredTownships = townships.filter((ts: any) => Number(ts.region_id) === Number(regionId));
              const townshipExists = filteredTownships.some((ts: any) => Number(ts.id) === Number(townshipId));
              
              if (townshipExists && filteredTownships.length > 0) {
                console.log('Setting township_id:', townshipId, 'for region:', regionId);
                form.setValue('township_id', Number(townshipId), { shouldValidate: false, shouldDirty: false });
              } else {
                console.log('Township not found in filtered list for region:', regionId, 'townshipId:', townshipId);
              }
            }
          }, 100);
        }
        form.setValue('address', property.location?.address || '', { shouldValidate: false });
        form.setValue('latitude', property.location?.latitude ? Number(property.location.latitude) : undefined, { shouldValidate: false });
        form.setValue('longitude', property.location?.longitude ? Number(property.location.longitude) : undefined, { shouldValidate: false });

        // Price and details
        const priceNum = property.price ? Number(property.price) : undefined;
        const areaNum = property.area_sqft ? Number(property.area_sqft) : undefined;
        if (priceNum !== undefined && !isNaN(priceNum)) {
          form.setValue('price', priceNum, { shouldValidate: false });
        }
        form.setValue('bedrooms', property.bedrooms ?? 0, { shouldValidate: false });
        form.setValue('bathrooms', property.bathrooms ?? 0, { shouldValidate: false });
        const lengthNum = property.length ? Number(property.length) : undefined;
        const widthNum = property.width ? Number(property.width) : undefined;
        if (lengthNum !== undefined && !isNaN(lengthNum)) {
          form.setValue('length', lengthNum, { shouldValidate: false });
        }
        if (widthNum !== undefined && !isNaN(widthNum)) {
          form.setValue('width', widthNum, { shouldValidate: false });
        }
        if (areaNum !== undefined && !isNaN(areaNum)) {
          form.setValue('area_sqft', areaNum, { shouldValidate: false });
        }

        // Contact
        form.setValue('owner_name', property.contact_info?.owner_name || '', { shouldValidate: false });
        form.setValue('email', property.contact_info?.email || '', { shouldValidate: false });
        
        // Phone numbers
        const phones = property.contact_info?.phone_numbers || [];
        if (phones.length > 0) {
          setPhoneNumbers(phones);
          form.setValue('phone_numbers', phones, { shouldValidate: false });
        }

        // Media - check if media exists in response (structure: media.images array)
        const propertyWithMedia = property as any;
        const mediaArray = propertyWithMedia.media?.images || propertyWithMedia.media || [];
        if (Array.isArray(mediaArray) && mediaArray.length > 0) {
          const mediaFiles = mediaArray.map((m: any) => ({
            id: m.id,
            url: m.url || m.medium_url || m.small_url || m.thumbnail_url,
            filename: m.filename || m.original_filename || 'file',
            type: (m.type === 'video' || m.media_type === 'video') ? 'video' : 'image' as 'image' | 'video',
            size: m.size || 0
          }));
          setInitialMediaFiles(mediaFiles);
          const ids = mediaArray.map((m: any) => m.id);
          setMediaIds(ids);
          form.setValue('media_ids', ids, { shouldValidate: false });
        }

          // Status and flags
          if (property.status) {
            const status = property.status as 'draft' | 'published' | 'sold' | 'rented';
            form.setValue('status', status as any, { shouldValidate: false, shouldDirty: false });
            // Only track original status if it's draft or published (not sold/rented)
            if (status === 'draft' || status === 'published') {
              setOriginalStatus(status);
            }
          }
        form.setValue('tan_tan_tan', property.tan_tan_tan || false, { shouldValidate: false, shouldDirty: false });
        form.setValue('is_trending', property.is_trending || false, { shouldValidate: false, shouldDirty: false });
        form.setValue('bank_installment_available', property.bank_installment_available || false, { shouldValidate: false, shouldDirty: false });

        formInitializedRef.current = true;
        console.log('Form initialized. Current form values:', form.getValues());
        
        // Force a re-render after a short delay to ensure Select components update
        setTimeout(() => {
          // Trigger a validation check which will also trigger re-renders of watched components
          form.trigger();
          // Force update by resetting form state
          const currentValues = form.getValues();
          console.log('Final form values after initialization:', currentValues);
        }, 150);
      }, 50);
      
      return () => {
        clearTimeout(initTimer);
      };
    } else if (hasProperty && !hasLookupData && !formInitializedRef.current) {
      console.log('Property loaded but lookup data not ready yet. Waiting...');
      console.log('Property:', !!property, 'Regions:', regions.length, 'Townships:', townships.length, 'PropertyTypes:', propertyTypes.length, 'ListingTypes:', listingTypes.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property, regions, townships, propertyTypes, listingTypes, slug, propertyLoading, propertyData]);

  // Initialize default values to avoid undefined for arrays
  useEffect(() => {
    if (!form.getValues('phone_numbers')) {
      form.setValue('phone_numbers', []);
    }
    if (!form.getValues('media_ids')) {
      form.setValue('media_ids', []);
    }
  }, []);

  // Sync mediaIds state with form when it changes
  useEffect(() => {
    form.setValue('media_ids', mediaIds);
  }, [mediaIds]);

  const addPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, '']);
    setPhoneErrors([...phoneErrors, '']);
  };

  const removePhoneNumber = (index: number) => {
    const newNums = phoneNumbers.filter((_, i) => i !== index);
    setPhoneNumbers(newNums);
    form.setValue('phone_numbers', newNums.filter((n) => n.trim() !== ''));
    const newErr = phoneErrors.filter((_, i) => i !== index);
    setPhoneErrors(newErr);
  };

  const updatePhoneNumber = (index: number, value: string) => {
    const newNums = [...phoneNumbers];
    newNums[index] = value;
    setPhoneNumbers(newNums);
    const regex = /^\+?[0-9]{1,13}$/;
    const newErrs = [...phoneErrors];
    if (value.trim() === '') newErrs[index] = '';
    else if (!regex.test(value)) newErrs[index] = t('validation.phoneNumbers.invalid');
    else newErrs[index] = '';
    setPhoneErrors(newErrs);
    form.setValue('phone_numbers', newNums.filter((n) => n.trim() !== ''));
    if (newErrs.some((m) => m)) {
      form.setError('phone_numbers', { type: 'manual', message: t('validation.phoneNumbers.invalid') as string });
    } else {
      form.clearErrors('phone_numbers');
    }
  };

  // Fetch point settings when dialog opens
  useEffect(() => {
    if (showConfirmDialog && !pointSettings && !loadingPointSettings) {
      const fetchPointSettings = async () => {
        setLoadingPointSettings(true);
        try {
          const response = await pointSettingsApi.getPointSettings();
          if (response.data && response.data.data) {
            setPointSettings(response.data.data);
          }
        } catch (err: any) {
          console.error('Failed to fetch point settings:', err);
          showError(err?.response?.data?.message || err?.message || 'Failed to load fee information', t('common.error') || 'Error');
          setShowConfirmDialog(false);
        } finally {
          setLoadingPointSettings(false);
        }
      };
      fetchPointSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showConfirmDialog]);

  const onSubmit = async (data: any) => {
    console.log('Form submitted with data:', data);
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        media_ids: mediaIds,
      };
      console.log('Submitting payload:', payload);
      await updatePropertyMutation.mutateAsync({ slug: slug!, data: payload });
      setShowConfirmDialog(false);
      setIsSubmitting(false);
      showSuccess(t('editProperty.successMessage') || 'Property updated successfully!', t('editProperty.successTitle') || 'Success!');
      // Redirect to detail page - will automatically refetch due to refetchOnMount: 'always'
      if (slug) {
        navigate(`/my-properties/${slug}`);
      } else {
        // Fallback to list page if slug is not available
        navigate('/my-properties');
      }
    } catch (err: any) {
      console.error('Submit error:', err);
      setIsSubmitting(false);
      setShowConfirmDialog(false);
      const msg = err?.response?.data?.message || err?.message || t('editProperty.errorMessage');
      showError(msg, t('editProperty.errorTitle') || 'Error');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submit event triggered');
    
    // Trigger validation and wait for it to complete
    const isValid = await form.trigger();
    
    console.log('Form state after validation:', {
      isValid,
      errors: form.formState.errors,
      values: form.getValues()
    });
    
    if (!isValid) {
      // Validation failed, errors will be shown by FormField components
      return;
    }
    
    // If sold or rented, prevent any changes
    if (isSoldOrRented) {
      showError(t('editProperty.cannotEditSoldRented') || 'Cannot edit sold or rented properties', t('common.error') || 'Error');
      return;
    }
    
    const formData = form.getValues();
    const newStatus = formData.status as 'draft' | 'published';
    const currentIsTrending = property?.is_trending || false;
    const newIsTrending = formData.is_trending || false;
    
    // Check if status changed from draft to published - show confirmation dialog
    const isStatusChangingToPublished = originalStatus === 'draft' && newStatus === 'published';
    
    // Check if premium is being added
    const isAddingPremium = newIsTrending && !currentIsTrending;
    
    // Only show confirmation dialog if:
    // 1. Status is changing from draft to published, OR
    // 2. Premium is being added AND status is published (not draft)
    const shouldShowConfirmDialog = isStatusChangingToPublished || (isAddingPremium && (originalStatus === 'published' || newStatus === 'published'));
    
    if (shouldShowConfirmDialog) {
      // Status changing to published or premium being added to published property, show confirmation dialog
      setPendingSubmitData(formData);
      
      // Fetch point settings for fee information
      setLoadingPointSettings(true);
      try {
        const response = await pointSettingsApi.getPointSettings();
        if (response.data && response.data.data) {
          setPointSettings(response.data.data);
        }
      } catch (err: any) {
        console.error('Failed to fetch point settings:', err);
        showError(err?.response?.data?.message || err?.message || 'Failed to load fee information', t('common.error') || 'Error');
        setLoadingPointSettings(false);
        return;
      }
      setLoadingPointSettings(false);
      
      setShowConfirmDialog(true);
    } else {
      // No status change to published and no premium addition, submit directly
      onSubmit(formData);
    }
  };

  const handleConfirmSubmit = () => {
    if (pendingSubmitData) {
      onSubmit(pendingSubmitData);
    }
  };

  const watchedRegionId = form.watch('region_id');
  const availableTownships = watchedRegionId ? townships.filter((ts: any) => Number(ts.region_id) === Number(watchedRegionId)) : [];
  
  // Additional effect to set township after region changes and availableTownships updates
  // Only run during initial form setup, not after user interactions
  useEffect(() => {
    if (property && formInitializedRef.current && !propertyLoading && !form.formState.isDirty) {
      const expectedTownshipId = property.location?.township?.id || (property as any).township_id;
      const currentTownshipId = form.watch('township_id');
      const expectedRegionId = property.location?.region?.id || (property as any).region_id;
      
      // Only proceed if we have both region and township IDs
      if (expectedRegionId && expectedTownshipId && watchedRegionId && Number(watchedRegionId) === Number(expectedRegionId)) {
        // Only set if township is not already set correctly
        if (!currentTownshipId || Number(currentTownshipId) !== Number(expectedTownshipId)) {
          // Wait for townships to be filtered for the selected region
          if (availableTownships.length > 0) {
            // Check if township is available in filtered list for the selected region
            const isAvailable = availableTownships.some((ts: any) => Number(ts.id) === Number(expectedTownshipId));
            if (isAvailable) {
              console.log('Auto-setting township_id:', expectedTownshipId, 'for region:', watchedRegionId);
              form.setValue('township_id', Number(expectedTownshipId), { shouldValidate: false, shouldDirty: false });
            } else {
              console.log('Township not available in filtered list. Expected:', expectedTownshipId, 'Available:', availableTownships.map((t: any) => t.id));
            }
          } else {
            console.log('Waiting for townships to be filtered for region:', watchedRegionId);
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedRegionId, availableTownships, propertyLoading, property]);

  // Loading state
  if (propertyLoading) {
    return (
      <>
        <SEOHead seo={seo} path={`/properties/edit/${slug}`} />
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-24" />
            </div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="shadow-lg">
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (propertyError || !property) {
    return (
      <>
        <SEOHead seo={seo} path={`/properties/edit/${slug}`} />
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="shadow-lg">
              <CardContent className="py-12 text-center">
                <p className="text-red-500 mb-4">{t('editProperty.notFound') || 'Property not found'}</p>
                <Button onClick={() => navigate('/my-properties')}>{t('common.back') || 'Back'}</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead seo={seo} path={`/properties/edit/${slug}`} />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                {t('editProperty.title') || 'Edit Property'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('editProperty.description') || 'Update your property details and media'}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('editProperty.back') || 'Back'}
            </Button>
          </div>

          {/* Warning Message for Restricted Editing */}
          {isEditingRestricted && (
            <div className="mb-6 rounded-lg border border-orange-500/50 bg-yellow-50/50 dark:bg-yellow-950/20 shadow-lg">
              <div className="px-5 pt-5 pb-5">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20">
                      <span className="text-yellow-600 dark:text-yellow-400 text-lg">⚠️</span>
                    </div>
                  </div>
                  <div className="flex-1 py-1">
                    <p className="text-sm font-medium text-orange-900 dark:text-yellow-200">
                      {isSoldOrRented 
                        ? (t('editProperty.soldRentedRestricted') || 'This property is sold or rented. Editing is not allowed.')
                        : (t('editProperty.restrictedEditing') || 'This property is published and approved. You can only change the status to Sold or Rented.')
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Home className="h-5 w-5 text-primary" />
                  {t('createProperty.basicInformation') || 'Basic Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField name="property_type_id" label={t('createProperty.propertyType')} error={errors.property_type_id} required>
                    <Select 
                      value={form.watch('property_type_id') ? String(form.watch('property_type_id')) : ''} 
                      onValueChange={(v) => form.setValue('property_type_id', Number(v), { shouldDirty: true })}
                      disabled={isEditingRestricted}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('createProperty.selectPropertyType')} />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((pt: any) => (
                          <SelectItem key={pt.id} value={String(pt.id)}>{language === 'mm' ? pt.name_mm : pt.name_en}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField name="listing_type_id" label={t('createProperty.listingType')} error={errors.listing_type_id} required>
                    <Select 
                      value={form.watch('listing_type_id') ? String(form.watch('listing_type_id')) : ''} 
                      onValueChange={(v) => form.setValue('listing_type_id', Number(v), { shouldDirty: true })}
                      disabled={isEditingRestricted}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('createProperty.selectListingType')} />
                      </SelectTrigger>
                      <SelectContent>
                        {listingTypes.map((lt: any) => (
                          <SelectItem key={lt.id} value={String(lt.id)}>{language === 'mm' ? lt.name_mm : lt.name_en}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField name="property_condition" label={t('createProperty.propertyCondition')} error={errors.property_condition} required>
                    <Select 
                      value={form.watch('property_condition') || ''} 
                      onValueChange={(v) => form.setValue('property_condition', v as 'ready' | 'some' | 'no', { shouldDirty: true })}
                      disabled={isEditingRestricted}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('createProperty.selectCondition')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ready">{language === 'mm' ? 'အားလုံး ပြင်ဆင်ထားပြီး' : 'Ready Decoration'}</SelectItem>
                        <SelectItem value="some">{language === 'mm' ? 'တချို့တစ်ဝက် ပြင်ဆင်ထားပြီး' : 'Some Decoration'}</SelectItem>
                        <SelectItem value="no">{language === 'mm' ? 'အကြမ်းထည်' : 'No Decoration'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="title_en" label={t('createProperty.titleEn')} error={errors.title_en} required>
                    <Input {...form.register('title_en')} disabled={isEditingRestricted} />
                  </FormField>
                  <FormField name="title_mm" label={t('createProperty.titleMm')} error={errors.title_mm} required>
                    <Input {...form.register('title_mm')} disabled={isEditingRestricted} />
                  </FormField>
                </div>

                <FormField name="description" label={t('createProperty.descriptionLabel')} error={errors.description} required>
                  <Textarea rows={4} {...form.register('description')} disabled={isEditingRestricted} />
                </FormField>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  {t('createProperty.location') || 'Location'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="region_id" label={t('createProperty.region')} error={errors.region_id} required>
                    <Select 
                      value={form.watch('region_id') ? String(form.watch('region_id')) : ''} 
                      onValueChange={(v) => { 
                        form.setValue('region_id', Number(v), { shouldDirty: true }); 
                        form.setValue('township_id', undefined as any, { shouldDirty: true }); 
                      }}
                      disabled={isEditingRestricted}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('createProperty.selectRegion')} />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((r: any) => (
                          <SelectItem key={r.id} value={String(r.id)}>{language === 'mm' ? r.name_mm : r.name_en}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                  <FormField name="township_id" label={t('createProperty.township')} error={errors.township_id} required>
                    <Select 
                      value={form.watch('township_id') ? String(form.watch('township_id')) : ''} 
                      onValueChange={(v) => form.setValue('township_id', Number(v), { shouldDirty: true })}
                      disabled={isEditingRestricted}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('createProperty.selectTownship')} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTownships.map((ts: any) => (
                          <SelectItem key={ts.id} value={String(ts.id)}>{language === 'mm' ? ts.name_mm : ts.name_en}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>
                <FormField name="address" label={t('createProperty.address')} error={errors.address} required>
                  <Input {...form.register('address')} disabled={isEditingRestricted} />
                </FormField>
                {/* Price, Bedrooms, Bathrooms as a row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField name="price" label={t('createProperty.price')} error={errors.price} required>
                    <Input type="number" placeholder={t('createProperty.price')} {...form.register('price')} disabled={isEditingRestricted} />
                  </FormField>
                  <FormField name="bedrooms" label={t('createProperty.bedrooms')} error={errors.bedrooms} required>
                    <Input type="number" placeholder={t('createProperty.bedrooms')} {...form.register('bedrooms')} disabled={isEditingRestricted} />
                  </FormField>
                  <FormField name="bathrooms" label={t('createProperty.bathrooms')} error={errors.bathrooms} required>
                    <Input type="number" placeholder={t('createProperty.bathrooms')} {...form.register('bathrooms')} disabled={isEditingRestricted} />
                  </FormField>
                </div>
                {/* Length, Width, Area as a row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField name="length" label={t('createProperty.length')} error={errors.length}>
                    <Input placeholder={t('createProperty.length')} type="number" {...form.register('length')} disabled={isEditingRestricted} />
                  </FormField>
                  <FormField name="width" label={t('createProperty.width')} error={errors.width}>
                    <Input placeholder={t('createProperty.width')} type="number" {...form.register('width')} disabled={isEditingRestricted} />
                  </FormField>
                  <FormField name="area_sqft" label={t('createProperty.areaSqft')} error={errors.area_sqft} required>
                    <Input type="number" placeholder={t('createProperty.areaSqft')} {...form.register('area_sqft')} disabled={isEditingRestricted} />
                  </FormField>
                </div>
                {/* Map Location Picker Link - at bottom of Location card */}
                {!isEditingRestricted && (
                  <div className="pt-2 border-t">
                    <MapLocationPicker
                      latitude={form.watch('latitude')}
                      longitude={form.watch('longitude')}
                      onLocationSelect={(lat, lng) => {
                        form.setValue('latitude', lat);
                        form.setValue('longitude', lng);
                      }}
                      buttonVariant="link"
                      className="p-0 h-auto text-primary hover:text-primary/80 underline justify-start items-start sm:items-center"
                    />
                  </div>
                )}
                {/* Hidden inputs for latitude and longitude - still submitted to API */}
                <Input 
                  type="hidden" 
                  {...form.register('latitude')} 
                />
                <Input 
                  type="hidden" 
                  {...form.register('longitude')} 
                />
              </CardContent>
            </Card>

            {/* Media */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Image className="h-5 w-5 text-primary" />
                  {t('createAdvertisement.media')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField 
                  name="media_ids" 
                  label="" 
                  error={errors.media_ids} 
                  required
                  className="space-y-2"
                >
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{t('createAdvertisement.mediaDescription')}</p>
                    <MediaUpload 
                      onUploadComplete={(ids) => {
                        setMediaIds(ids);
                        form.setValue('media_ids', ids, { shouldValidate: true });
                      }} 
                      onUploadError={(msg) => showError(msg, t('common.error'))} 
                      onLoadingChange={(isLoading) => setIsMediaLoading(isLoading)}
                      maxFiles={8}
                      className="min-h-[360px]"
                      initialFiles={initialMediaFiles}
                      disabled={isEditingRestricted}
                    />
                    {/* Hidden input to register media_ids field for validation */}
                    <input type="hidden" {...form.register('media_ids')} />
                  </div>
                </FormField>
              </CardContent>
            </Card>

            {/* Contact & flags */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Phone className="h-5 w-5 text-primary" />
                  {t('createProperty.contactInformation') || 'Contact Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField name="owner_name" label={t('createProperty.ownerName')} error={errors.owner_name} required>
                    <Input {...form.register('owner_name')} disabled={isEditingRestricted} />
                  </FormField>
                  <FormField name="email" label={t('createProperty.email')} error={errors.email}>
                    <Input type="email" autoComplete="email" {...form.register('email')} disabled={isEditingRestricted} />
                  </FormField>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      {t('createAdvertisement.phoneNumbers') || 'Phone Numbers'} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <Input 
                        value={phoneNumbers[0] || ''} 
                        onChange={(e) => updatePhoneNumber(0, e.target.value)} 
                        placeholder="e.g., +959445566778" 
                        inputMode="tel" 
                        autoComplete="tel" 
                        className="flex-1"
                        disabled={isEditingRestricted}
                      />
                      <Button type="button" variant="outline" size="sm" onClick={addPhoneNumber} className="whitespace-nowrap" disabled={isEditingRestricted}>
                        + Add More
                      </Button>
                    </div>
                    {phoneErrors[0] && <p className="text-xs text-red-500">{phoneErrors[0]}</p>}
                    {errors.phone_numbers && (
                      <p className="text-xs text-red-500">{errors.phone_numbers.message}</p>
                    )}
                  </div>
                </div>
                {phoneNumbers.length > 1 && (
                  <div className="space-y-2 max-w-md">
                    {phoneNumbers.slice(1).map((ph, idx) => (
                      <div key={idx + 1} className="space-y-1">
                        <div className="flex gap-2">
                          <Input 
                            value={ph} 
                            onChange={(e) => updatePhoneNumber(idx + 1, e.target.value)} 
                            placeholder="e.g., +959445566778" 
                            className="flex-1" 
                            inputMode="tel" 
                            autoComplete="tel" 
                            disabled={isEditingRestricted}
                          />
                          <Button type="button" variant="outline" size="sm" onClick={() => removePhoneNumber(idx + 1)} className="px-3" disabled={isEditingRestricted}>×</Button>
                        </div>
                        {phoneErrors[idx + 1] && <p className="text-xs text-red-500">{phoneErrors[idx + 1]}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  {t('createProperty.status') || 'Status'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Publish Status */}
                <FormField name="status" label={t('createProperty.publishStatus') || 'Publish Status'} error={errors.status}>
                  {isSoldOrRented ? (
                    <>
                      <Select 
                        value={form.watch('status') || ''} 
                        disabled={true}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">{t('createAdvertisement.draft') || 'Draft'}</SelectItem>
                          <SelectItem value="published">{t('createAdvertisement.published') || 'Published'}</SelectItem>
                          <SelectItem value="sold">{t('editProperty.sold') || 'Sold'}</SelectItem>
                          <SelectItem value="rented">{t('editProperty.rented') || 'Rented'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  ) : isPublishedAndApproved ? (
                    <>
                      <Select 
                        value={form.watch('status') || 'published'} 
                        onValueChange={(v) => form.setValue('status', v as any)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="published">{t('createAdvertisement.published') || 'Published'}</SelectItem>
                          <SelectItem value="sold">{t('editProperty.sold') || 'Sold'}</SelectItem>
                          <SelectItem value="rented">{t('editProperty.rented') || 'Rented'}</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('editProperty.restrictedEditing') || '⚠️ This property is published and approved. You can only change the status to Sold or Rented.'}
                      </p>
                    </>
                  ) : (
                    <>
                      <Select 
                        value={form.watch('status') || 'published'} 
                        onValueChange={(v) => form.setValue('status', v as 'draft' | 'published')}
                        disabled={originalStatus === 'published'} // Disable if already published
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem 
                            value="draft"
                            disabled={originalStatus === 'published'} // Disable draft option if already published
                          >
                            {t('createAdvertisement.draft') || 'Draft'}
                          </SelectItem>
                          <SelectItem value="published">{t('createAdvertisement.published') || 'Published'}</SelectItem>
                        </SelectContent>
                      </Select>
                      {originalStatus === 'published' && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('editProperty.cannotDowngradeStatus') || '⚠️ Cannot change from Published to Draft'}
                        </p>
                      )}
                    </>
                  )}
                </FormField>

                {/* Toggles Section */}
                <div className="space-y-4 pt-2">
                  <div className="text-sm font-medium text-foreground mb-3">
                    {t('createProperty.features') || 'Features'}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Tan Tan Tan */}
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors">
                      <div className="flex-1">
                        <label
                          htmlFor="tan_tan_tan"
                          className="text-sm font-medium leading-none block cursor-pointer mb-1"
                        >
                          {t('createProperty.tanTanTan') || 'Tan Tan Tan'}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {t('createProperty.tanTanTanDesc') || 'Mark this property as Tan Tan Tan'}
                        </p>
                      </div>
                      <Switch
                        id="tan_tan_tan"
                        checked={form.watch('tan_tan_tan') || false}
                        onCheckedChange={(checked) => form.setValue('tan_tan_tan', checked)}
                        className="ml-4"
                        disabled={isEditingRestricted}
                      />
                    </div>

                    {/* Premium */}
                    <div className={`flex items-start justify-between p-4 rounded-lg border transition-colors ${form.watch('is_trending') ? 'border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20' : 'border-border bg-card/50 hover:bg-card'}`}>
                      <div className="flex-1">
                        <label
                          htmlFor="is_trending"
                          className="text-sm font-medium leading-none block cursor-pointer mb-1"
                        >
                          {t('createProperty.isTrending') || 'Premium (Is Trending)'}
                        </label>
                        <p className={`text-xs ${form.watch('is_trending') ? 'text-yellow-700 dark:text-yellow-400 font-medium' : 'text-muted-foreground'}`}>
                          {t('createProperty.premiumWarning') || '⚠️ Extra charges will apply for premium listing'}
                        </p>
                      </div>
                      <Switch
                        id="is_trending"
                        checked={form.watch('is_trending') || false}
                        onCheckedChange={(checked) => form.setValue('is_trending', checked)}
                        className="ml-4 mt-0.5"
                        disabled={isEditingRestricted}
                      />
                    </div>

                    {/* Bank Installment */}
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors">
                      <div className="flex-1">
                        <label
                          htmlFor="bank_installment_available"
                          className="text-sm font-medium leading-none block cursor-pointer mb-1"
                        >
                          {t('createProperty.bankInstallment') || 'Bank Installment'}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {t('createProperty.bankInstallmentDesc') || 'Bank installment available for this property'}
                        </p>
                      </div>
                      <Switch
                        id="bank_installment_available"
                        checked={form.watch('bank_installment_available') || false}
                        onCheckedChange={(checked) => form.setValue('bank_installment_available', checked)}
                        className="ml-4"
                        disabled={isEditingRestricted}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button 
                type="submit" 
                className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50"
                disabled={isMediaLoading || updatePropertyMutation.isPending}
              >
                {updatePropertyMutation.isPending ? (t('common.saving') || 'Saving...') : (t('editProperty.update') || 'Update Property')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                {t('createAdvertisement.cancel')}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Dialog - Shown when changing status to published or adding premium */}
      <Dialog 
        open={showConfirmDialog} 
        onOpenChange={(open) => {
          setShowConfirmDialog(open);
          if (!open) {
            setPointSettings(null);
            setPendingSubmitData(null);
            setIsSubmitting(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-left">
                  {originalStatus === 'draft' && pendingSubmitData?.status === 'published'
                    ? (t('editProperty.confirmPublishTitle') || 'Confirm Publishing Property')
                    : (t('editProperty.confirmTitle') || 'Confirm Property Update')
                  }
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-1">
                  {originalStatus === 'draft' && pendingSubmitData?.status === 'published'
                    ? (t('editProperty.confirmPublishDescription') || 'You are publishing this property. Upload fees will apply.')
                    : (t('editProperty.confirmDescription') || 'Please review the fees before updating your property.')
                  }
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {loadingPointSettings ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-primary border-t-transparent"></div>
              <p className="mt-4 text-sm text-muted-foreground font-medium">
                {t('createProperty.loadingFees') || 'Loading fee information...'}
              </p>
            </div>
          ) : pointSettings ? (
            <div className="py-4">
              <div className="overflow-hidden border border-border rounded-lg">
                <table className="w-full border-collapse">
                  <tbody className="divide-y divide-border">
                    {/* Upload Fee - Only show when changing from draft to published */}
                    {originalStatus === 'draft' && pendingSubmitData?.status === 'published' && (
                      <tr className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-foreground">
                          {t('createProperty.uploadFee') || 'Upload Fee'}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-foreground">
                          {pointSettings.upload_info?.point_amount || 0} {t('createProperty.points') || 'Points'}
                        </td>
                      </tr>
                    )}
                    
                    {/* Premium Fee - Show when adding premium OR when publishing draft with premium */}
                    {((pendingSubmitData?.is_trending && !property?.is_trending) || 
                      (originalStatus === 'draft' && pendingSubmitData?.status === 'published' && pendingSubmitData?.is_trending)) 
                      && pointSettings.premium_property_info && (
                      <tr className="hover:bg-muted/30 transition-colors bg-yellow-50/30 dark:bg-yellow-950/10">
                        <td className="px-4 py-3 text-sm font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <span>{t('createProperty.premiumFee') || 'Premium Fee'}</span>
                            <span className="inline-flex items-center rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:text-yellow-300">
                              Premium
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-foreground">
                          {pointSettings.premium_property_info?.point_amount || 0} {t('createProperty.points') || 'Points'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {(originalStatus === 'draft' && pendingSubmitData?.status === 'published') || (pendingSubmitData?.is_trending && !property?.is_trending) ? (
                    <tfoot>
                      <tr className="bg-primary/5 border-t-2 border-primary/20">
                        <td className="px-4 py-4 text-right text-sm font-semibold text-foreground">
                          {t('createProperty.totalFee') || 'Total'}
                        </td>
                        <td className="px-4 py-4 text-right text-base font-bold text-primary">
                          {(
                            (originalStatus === 'draft' && pendingSubmitData?.status === 'published' ? (pointSettings.upload_info?.point_amount || 0) : 0) +
                            ((pendingSubmitData?.is_trending && !property?.is_trending) || (originalStatus === 'draft' && pendingSubmitData?.status === 'published' && pendingSubmitData?.is_trending) ? (pointSettings.premium_property_info?.point_amount || 0) : 0)
                          )} {t('createProperty.points') || 'Points'}
                        </td>
                      </tr>
                    </tfoot>
                  ) : null}
                </table>
              </div>
              
              {/* Validity Period Info - Only show when publishing */}
              {originalStatus === 'draft' && pendingSubmitData?.status === 'published' && (
                <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/50">
                  <p className="text-xs text-muted-foreground text-center">
                    <CheckCircle2 className="inline h-3 w-3 mr-1" />
                    {t('createProperty.uploadFeeDesc') || 'Valid for'} <span className="font-medium text-foreground">{pointSettings.upload_info?.days || 0}</span> {t('createProperty.days') || 'days'}
                  </p>
                </div>
              )}
            </div>
          ) : null}

          <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowConfirmDialog(false);
                setPointSettings(null);
                setPendingSubmitData(null);
                setIsSubmitting(false);
              }}
              disabled={loadingPointSettings || isSubmitting}
              className="w-full sm:w-auto"
            >
              {t('common.cancel') || 'Cancel'}
            </Button>
            <Button 
              onClick={handleConfirmSubmit}
              disabled={loadingPointSettings || isSubmitting || !pointSettings}
              className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  {t('editProperty.updating') || 'Updating...'}
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {t('editProperty.confirmSubmit') || 'Confirm & Update'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

