import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Home, Phone, Image, CheckCircle, CheckCircle2, FileText, Sparkles, X, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { useModal } from '@/contexts/ModalContext';
import { useRegions, useTownships } from '@/hooks/queries/useLocations';
import { usePropertyTypes } from '@/hooks/queries/usePropertyTypes';
import { useListingTypes } from '@/hooks/queries/useProperties';
import { MediaUpload } from '@/components/MediaUpload';
import { MapLocationPicker } from '@/components/MapLocationPicker';
import { propertyApi } from '@/services/api/properties';
import { pointSettingsApi } from '@/services/api/pointSettings';
import { useFormValidation } from '@/hooks/useFormValidation';
import { createPropertySchema } from '@/lib/validation/property';
import { FormField } from '@/components/forms';

export default function CreateProperty() {
  const navigate = useNavigate();
  const seo = seoUtils.getPageSEO('createProperty');
  const { t, language } = useLanguage();
  const { showSuccess, showError } = useModal();

  // Lookups
  const { data: regionsResp } = useRegions();
  const { data: townshipsResp } = useTownships();
  const { data: propertyTypesResp } = usePropertyTypes();
  const { data: listingTypesResp } = useListingTypes();
  const regions = regionsResp?.data || [];
  const townships = townshipsResp?.data || [];
  const propertyTypes = propertyTypesResp?.data || [];
  const listingTypes = listingTypesResp?.data || [];

  // Form validation (same pattern as advertisements)
  const { form, errors } = useFormValidation(createPropertySchema);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(['']);
  const [phoneErrors, setPhoneErrors] = useState<string[]>(['']);

  const [mediaIds, setMediaIds] = useState<number[]>([]);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [featureInput, setFeatureInput] = useState<string>('');
  
  // Confirmation dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pointSettings, setPointSettings] = useState<any>(null);
  const [loadingPointSettings, setLoadingPointSettings] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<any>(null);
  const [confirmStatus, setConfirmStatus] = useState<'draft' | 'published'>('published');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize default values to avoid undefined for arrays
  useEffect(() => {
    if (!form.getValues('phone_numbers')) {
      form.setValue('phone_numbers', []);
    }
    if (!form.getValues('media_ids')) {
      form.setValue('media_ids', []);
    }
    if (!form.getValues('features')) {
      form.setValue('features', []);
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

  const handleAddFeature = () => {
    const trimmedValue = featureInput.trim();
    if (trimmedValue === '') return;
    
    const currentFeatures = form.watch('features') || [];
    if (!currentFeatures.includes(trimmedValue)) {
      form.setValue('features', [...currentFeatures, trimmedValue]);
    }
    setFeatureInput('');
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    const currentFeatures = form.watch('features') || [];
    form.setValue('features', currentFeatures.filter((f: string) => f !== featureToRemove));
  };

  const handleFeatureInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFeature();
    }
  };

  // Fetch point settings when dialog opens
  useEffect(() => {
    if (showConfirmDialog && !pointSettings && !loadingPointSettings) {
      const fetchPointSettings = async () => {
        setLoadingPointSettings(true);
        try {
          const response = await pointSettingsApi.getPointSettings();
          // response.data is the API wrapper, response.data.data is the actual PointSettings
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
    console.log('Form errors:', form.formState.errors);
    console.log('Media IDs:', mediaIds);
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        media_ids: mediaIds,
      };
      console.log('Submitting payload:', payload);
      const response = await propertyApi.createMyProperty(payload);
      setShowConfirmDialog(false);
      setIsSubmitting(false);
      showSuccess(t('createProperty.successMessage') || 'Property created successfully!', t('createProperty.successTitle') || 'Success!');
      // Redirect to detail page using slug from response
      const propertySlug = response.data?.data?.slug;
      if (propertySlug) {
        navigate(`/my-properties/${propertySlug}`);
      } else {
        // Fallback to list page if slug is not available
        navigate('/my-properties');
      }
    } catch (err: any) {
      console.error('Submit error:', err);
      setIsSubmitting(false);
      setShowConfirmDialog(false);
      const msg = err?.response?.data?.message || err?.message || t('createProperty.errorMessage');
      showError(msg, t('createProperty.errorTitle') || 'Error');
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
    
    // Store the form data for later submission
    const formData = form.getValues();
    setPendingSubmitData(formData);
    
    // Reset status to published by default
    setConfirmStatus('published');
    
    // Fetch point settings
    setLoadingPointSettings(true);
    try {
      const response = await pointSettingsApi.getPointSettings();
      setPointSettings(response.data.data);
    } catch (error) {
      console.error('Failed to fetch point settings:', error);
      showError(t('createProperty.errorFetchingFees') || 'Failed to fetch fee information. Please try again.', t('common.error') || 'Error');
      setLoadingPointSettings(false);
      return;
    }
    setLoadingPointSettings(false);
    
    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = () => {
    if (pendingSubmitData) {
      // Add status to the submission data
      const dataWithStatus = {
        ...pendingSubmitData,
        status: confirmStatus,
      };
      onSubmit(dataWithStatus);
    }
  };

  const watchedRegionId = form.watch('region_id');
  const availableTownships = watchedRegionId ? townships.filter((ts: any) => Number(ts.region_id) === Number(watchedRegionId)) : [];

  return (
    <>
      <SEOHead seo={seo} path="/properties/create" />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                {t('createProperty.title') || 'Create Property'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('createProperty.description') || 'Post your property with details and media'}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/my-properties')} className="hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('createProperty.back') || 'Back'}
            </Button>
          </div>

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
                    <Select value={form.watch('property_type_id') ? String(form.watch('property_type_id')) : undefined} onValueChange={(v) => form.setValue('property_type_id', Number(v))}>
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
                    <Select value={form.watch('listing_type_id') ? String(form.watch('listing_type_id')) : undefined} onValueChange={(v) => form.setValue('listing_type_id', Number(v))}>
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
                    <Select value={form.watch('property_condition') || ''} onValueChange={(v) => form.setValue('property_condition', v as 'ready' | 'some' | 'no')}>
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
                    <Input {...form.register('title_en')} />
                  </FormField>
                  <FormField name="title_mm" label={t('createProperty.titleMm')} error={errors.title_mm} required>
                    <Input {...form.register('title_mm')} />
                  </FormField>
                </div>

                <FormField name="description" label={t('createProperty.descriptionLabel')} error={errors.description} required>
                  <Textarea rows={4} {...form.register('description')} />
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
                    <Select value={form.watch('region_id') ? String(form.watch('region_id')) : undefined} onValueChange={(v) => { form.setValue('region_id', Number(v)); form.setValue('township_id', undefined as any); }}>
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
                    <Select value={form.watch('township_id') ? String(form.watch('township_id')) : undefined} onValueChange={(v) => form.setValue('township_id', Number(v))}>
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
                  <Input {...form.register('address')} />
                </FormField>
                {/* Price, Bedrooms, Bathrooms as a row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField name="price" label={t('createProperty.price')} error={errors.price} required>
                    <Input type="number" placeholder={t('createProperty.price')} {...form.register('price')} />
                  </FormField>
                  <FormField name="bedrooms" label={t('createProperty.bedrooms')} error={errors.bedrooms} required>
                    <Input type="number" placeholder={t('createProperty.bedrooms')} {...form.register('bedrooms')} />
                  </FormField>
                  <FormField name="bathrooms" label={t('createProperty.bathrooms')} error={errors.bathrooms} required>
                    <Input type="number" placeholder={t('createProperty.bathrooms')} {...form.register('bathrooms')} />
                  </FormField>
                </div>
                {/* Length, Width, Area as a row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField name="length" label={t('createProperty.length')} error={errors.length}>
                    <Input placeholder={t('createProperty.length')} type="number" {...form.register('length')} />
                  </FormField>
                  <FormField name="width" label={t('createProperty.width')} error={errors.width}>
                    <Input placeholder={t('createProperty.width')} type="number" {...form.register('width')} />
                  </FormField>
                  <FormField name="area_sqft" label={t('createProperty.areaSqft')} error={errors.area_sqft} required>
                    <Input type="number" placeholder={t('createProperty.areaSqft')} {...form.register('area_sqft')} />
                  </FormField>
                </div>
                {/* Map Location Picker Link - at bottom of Location card */}
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
                    <Input {...form.register('owner_name')} />
                  </FormField>
                  <FormField name="email" label={t('createProperty.email')} error={errors.email}>
                    <Input type="email" autoComplete="email" {...form.register('email')} />
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
                      />
                      <Button type="button" variant="outline" size="sm" onClick={addPhoneNumber} className="whitespace-nowrap">
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
                          />
                          <Button type="button" variant="outline" size="sm" onClick={() => removePhoneNumber(idx + 1)} className="px-3">×</Button>
                        </div>
                        {phoneErrors[idx + 1] && <p className="text-xs text-red-500">{phoneErrors[idx + 1]}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Features */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {t('createProperty.propertyFeatures') || 'Feature & Amenities'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField 
                  name="features" 
                  label="" 
                  error={errors.features}
                  className="space-y-3"
                >
                  <div className="space-y-3">
                    {/* Input field with Add button */}
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder={t('createProperty.featurePlaceholder') || 'Type a feature and press Enter or click Add'}
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyDown={handleFeatureInputKeyDown}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddFeature}
                        className="whitespace-nowrap"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {t('common.add') || 'Add'}
                      </Button>
                    </div>
                    
                    {/* Badges display */}
                    {form.watch('features') && (form.watch('features') || []).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {(form.watch('features') || []).map((feature: string) => (
                          <Badge
                            key={feature}
                            variant="outline"
                            className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-3 py-1"
                          >
                            {feature}
                            <button
                              type="button"
                              onClick={() => handleRemoveFeature(feature)}
                              className="ml-2 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                            >
                              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </FormField>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  {t('createProperty.features') || 'Features'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                disabled={isMediaLoading}
              >
                {t('createProperty.create') || 'Create Property'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/my-properties')}>
                {t('createAdvertisement.cancel')}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog 
        open={showConfirmDialog} 
        onOpenChange={(open) => {
          setShowConfirmDialog(open);
          if (!open) {
            // Reset when dialog closes
            setPointSettings(null);
            setPendingSubmitData(null);
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
                  {t('createProperty.confirmTitle') || 'Confirm Property Upload'}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-1">
                  {t('createProperty.confirmDescription') || 'Please review the upload fees before submitting your property.'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {/* Status Selection */}
          <div className="py-4 border-b border-border">
            <label className="text-sm font-medium text-foreground mb-3 block">
              {t('createProperty.selectPublishStatus') || 'Choose how you want to publish:'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfirmStatus('published')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  confirmStatus === 'published'
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-border hover:border-primary/50 bg-background'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className={`h-5 w-5 ${confirmStatus === 'published' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`font-medium ${confirmStatus === 'published' ? 'text-primary' : 'text-foreground'}`}>
                    {t('createAdvertisement.published') || 'Published'}
                  </span>
                  <span className="text-xs text-muted-foreground text-center">
                    {t('createProperty.publishedDesc') || 'Publish now (charges apply)'}
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setConfirmStatus('draft')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  confirmStatus === 'draft'
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-border hover:border-primary/50 bg-background'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <FileText className={`h-5 w-5 ${confirmStatus === 'draft' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`font-medium ${confirmStatus === 'draft' ? 'text-primary' : 'text-foreground'}`}>
                    {t('createAdvertisement.draft') || 'Draft'}
                  </span>
                  <span className="text-xs text-muted-foreground text-center">
                    {t('createProperty.draftDesc') || 'Save as draft (no charges)'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Fee Information - Only show if Published is selected */}
          {confirmStatus === 'published' && (
            <>
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
                        <tr className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-foreground">
                            {t('createProperty.uploadFee') || 'Upload Fee'}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-foreground">
                            {pointSettings.upload_info?.point_amount || 0} {t('createProperty.points') || 'Points'}
                          </td>
                        </tr>
                        {form.watch('is_trending') && pointSettings.premium_property_info && (
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
                      <tfoot>
                        <tr className="bg-primary/5 border-t-2 border-primary/20">
                          <td className="px-4 py-4 text-right text-sm font-semibold text-foreground">
                            {t('createProperty.totalFee') || 'Total'}
                          </td>
                          <td className="px-4 py-4 text-right text-base font-bold text-primary">
                            {(
                              (pointSettings.upload_info?.point_amount || 0) +
                              (form.watch('is_trending') ? (pointSettings.premium_property_info?.point_amount || 0) : 0)
                            )} {t('createProperty.points') || 'Points'}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  
                  {/* Validity Period Info */}
                  <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/50">
                    <p className="text-xs text-muted-foreground text-center">
                      <CheckCircle2 className="inline h-3 w-3 mr-1" />
                      {t('createProperty.uploadFeeDesc') || 'Valid for'} <span className="font-medium text-foreground">{pointSettings.upload_info?.days || 0}</span> {t('createProperty.days') || 'days'}
                    </p>
                  </div>
                </div>
              ) : null}
            </>
          )}

          {/* Draft Info */}
          {confirmStatus === 'draft' && (
            <div className="py-4">
              <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground mb-1">
                      {t('createProperty.draftInfo') || 'Saving as Draft'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('createProperty.draftInfoDesc') || 'Your property will be saved as a draft. No points will be charged. You can publish it later from your property list.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowConfirmDialog(false);
                setPointSettings(null);
                setPendingSubmitData(null);
                setConfirmStatus('published');
                setIsSubmitting(false);
              }}
              disabled={loadingPointSettings || isSubmitting}
              className="w-full sm:w-auto"
            >
              {t('common.cancel') || 'Cancel'}
            </Button>
            <Button 
              onClick={handleConfirmSubmit}
              disabled={loadingPointSettings || isSubmitting || (confirmStatus === 'published' && !pointSettings)}
              className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  {confirmStatus === 'published' 
                    ? (t('createProperty.submitting') || 'Publishing...')
                    : (t('createProperty.saving') || 'Saving...')
                  }
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {confirmStatus === 'published' 
                    ? (t('createProperty.confirmSubmit') || 'Confirm & Publish')
                    : (t('createProperty.confirmSaveDraft') || 'Save as Draft')
                  }
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}


