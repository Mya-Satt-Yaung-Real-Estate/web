import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Home, Phone, Image, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
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

  // Initialize default values to avoid undefined for arrays
  useEffect(() => {
    if (!form.getValues('phone_numbers')) {
      form.setValue('phone_numbers', []);
    }
    if (!form.getValues('media_ids')) {
      form.setValue('media_ids', []);
    }
  }, []);

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

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        media_ids: mediaIds,
      };
      await propertyApi.createMyProperty(payload);
      showSuccess(t('createProperty.successMessage') || 'Property created successfully!', t('createProperty.successTitle') || 'Success!');
      navigate('/properties');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || t('createProperty.errorMessage');
      showError(msg, t('createProperty.errorTitle') || 'Error');
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
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('createProperty.back') || 'Back'}
            </Button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    className="p-0 h-auto text-primary hover:text-primary/80 underline"
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
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{t('createAdvertisement.mediaDescription')}</p>
                  <MediaUpload 
                    onUploadComplete={(ids) => setMediaIds(ids)} 
                    onUploadError={(msg) => showError(msg, t('common.error'))} 
                    maxFiles={8}
                    className="min-h-[360px]"
                  />
                </div>
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
                  <Select value={form.watch('status') || 'published'} onValueChange={(v) => form.setValue('status', v as 'draft' | 'published')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">{t('createAdvertisement.draft') || 'Draft'}</SelectItem>
                      <SelectItem value="published">{t('createAdvertisement.published') || 'Published'}</SelectItem>
                    </SelectContent>
                  </Select>
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
              <Button type="submit" className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50">
                {t('createProperty.create') || 'Create Property'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                {t('createAdvertisement.cancel')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}


