import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, User, Phone, Image, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { useRegions, useTownships } from '@/hooks/queries/useLocations';
import { useLanguage } from '@/contexts/LanguageContext';
import { useModal } from '@/contexts/ModalContext';
import { useUpdateAdvertisement } from '@/hooks/mutations/useAdvertisementMutations';
import { useFormValidation } from '@/hooks/useFormValidation';
import { createAdvertisementSchema } from '@/lib/validation/advertisement';
import { FormField } from '@/components/forms';
import { MediaUpload } from '@/components/MediaUpload';
import { useAdvertisement } from '@/hooks/queries/useAdvertisement';
import type { CreateAdvertisementData } from '@/types/advertisement';

export default function EditAdvertisement() {
  const navigate = useNavigate();
  const { id } = useParams();
  const advId = Number(id);
  const seo = seoUtils.getPageSEO('createAdvertisement');
  const { t, language } = useLanguage();

  // Fetch existing advertisement and locations
  const { data: advData, isLoading: advLoading } = useAdvertisement(advId);
  const { data: regionsData, isLoading: regionsLoading } = useRegions();
  const { data: townshipsData, isLoading: townshipsLoading } = useTownships();

  // Mutation
  const updateMutation = useUpdateAdvertisement();

  // Modal
  const { showSuccess, showError } = useModal();

  // Form
  const { form, errors } = useFormValidation(createAdvertisementSchema);

  // Local state
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(['']);
  const [phoneErrors, setPhoneErrors] = useState<string[]>(['']);
  const [mediaIds, setMediaIds] = useState<number[]>([]);

  const isLoading = advLoading || regionsLoading || townshipsLoading;
  const regions = regionsData?.data || [];
  const townships = townshipsData?.data || [];

  const watchedRegionId = form.watch('region_id');
  const availableTownships = townships.filter(t => t.region_id === watchedRegionId);

  // Prefill when advertisement data is ready
  useEffect(() => {
    if (!advData?.data) return;
    const a = advData.data;
    form.setValue('title_en', a.title_en);
    form.setValue('title_mm', a.title_mm);
    form.setValue('description', a.description || '');
    form.setValue('region_id', a.location?.region?.id || 0);
    form.setValue('township_id', a.location?.township?.id || 0);
    form.setValue('address', a.location?.address || '');
    form.setValue('contact_name', a.contact_info?.contact_name || '');
    const phones = a.contact_info?.phone_numbers || [];
    setPhoneNumbers(phones.length ? phones : ['']);
    setPhoneErrors(Array(phones.length || 1).fill(''));
    form.setValue('phone_numbers', phones);
    form.setValue('email', a.contact_info?.email || '');
    form.setValue('status', (a.is_published ? 'published' : 'draft') as any);
    form.setValue('media_ids', []);
  }, [advData]);

  // Initialize defaults
  useEffect(() => {
    if (!form.getValues('phone_numbers')) form.setValue('phone_numbers', []);
    if (!form.getValues('media_ids')) form.setValue('media_ids', []);
    if (!form.getValues('region_id')) form.setValue('region_id', 0);
    if (!form.getValues('township_id')) form.setValue('township_id', 0);
  }, []);

  const handleMediaUploadComplete = (ids: number[]) => {
    setMediaIds(ids);
    form.setValue('media_ids', ids);
  };
  const handleMediaError = (error: string) => {
    showError(error, t('createAdvertisement.errorTitle'));
  };

  const addPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, '']);
    setPhoneErrors([...phoneErrors, '']);
  };
  const removePhoneNumber = (index: number) => {
    const newPhoneNumbers = phoneNumbers.filter((_, i) => i !== index);
    setPhoneNumbers(newPhoneNumbers);
    form.setValue('phone_numbers', newPhoneNumbers.filter(num => num.trim() !== ''));
    setPhoneErrors(phoneErrors.filter((_, i) => i !== index));
  };
  const updatePhoneNumber = (index: number, value: string) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers[index] = value;
    setPhoneNumbers(newPhoneNumbers);
    const regex = /^\+?[0-9]{1,13}$/;
    const newErrors = [...phoneErrors];
    if (value.trim() === '') newErrors[index] = '';
    else if (!regex.test(value)) newErrors[index] = t('validation.phoneNumbers.invalid');
    else newErrors[index] = '';
    setPhoneErrors(newErrors);
    form.setValue('phone_numbers', newPhoneNumbers.filter(num => num.trim() !== ''));
    if (newErrors.some(msg => msg)) form.setError('phone_numbers', { type: 'manual', message: t('validation.phoneNumbers.invalid') as string });
    else form.clearErrors('phone_numbers');
  };

  const handleRegionChange = (value: string | undefined) => {
    const numeric = Number(value);
    form.setValue('region_id', Number.isFinite(numeric) && numeric > 0 ? numeric : 0);
    form.setValue('township_id', 0);
  };

  const onSubmit = (data: any) => {
    const payload: CreateAdvertisementData = {
      title_en: data.title_en,
      title_mm: data.title_mm,
      description: data.description,
      region_id: data.region_id,
      township_id: data.township_id,
      address: data.address,
      contact_name: data.contact_name,
      phone_numbers: data.phone_numbers || [],
      email: data.email || '',
      status: data.status || 'draft',
      media_ids: mediaIds,
    };

    updateMutation.mutate({ id: advId, data: payload }, {
      onSuccess: () => {
        showSuccess(t('createAdvertisement.successMessage'), t('createAdvertisement.successTitle'));
        setTimeout(() => navigate('/advertisements'), 1500);
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message || err?.message || t('createAdvertisement.errorMessage');
        showError(msg, t('createAdvertisement.errorTitle'));
      }
    });
  };

  return (
    <>
      <SEOHead seo={seo} path={`/advertisements/edit/${advId}`} />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                {t('createAdvertisement.title')}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('createAdvertisement.description')}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('createAdvertisement.back')}
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">{t('createAdvertisement.loading')}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-primary" />
                    {t('createAdvertisement.basicInformation')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField name="title_en" label={t('createAdvertisement.titleEn')} error={errors.title_en} required>
                      <Input {...form.register('title_en')} placeholder={t('createAdvertisement.titleEnPlaceholder')} />
                    </FormField>
                    <FormField name="title_mm" label={t('createAdvertisement.titleMm')} error={errors.title_mm} required>
                      <Input {...form.register('title_mm')} placeholder={t('createAdvertisement.titleMmPlaceholder')} />
                    </FormField>
                  </div>
                  <FormField name="description" label={t('createAdvertisement.descriptionLabel')} error={errors.description} required>
                    <Textarea {...form.register('description')} placeholder={t('createAdvertisement.descriptionPlaceholder')} rows={4} />
                  </FormField>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                    {t('createAdvertisement.location')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField name="region_id" label={t('createAdvertisement.region')} error={errors.region_id} required>
                      <Select value={form.watch('region_id') && form.watch('region_id') > 0 ? form.watch('region_id').toString() : undefined} onValueChange={(v) => handleRegionChange(v)}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('createAdvertisement.selectRegion')} />
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
                    <FormField name="township_id" label={t('createAdvertisement.township')} error={errors.township_id} required>
                      <Select value={form.watch('township_id') && form.watch('township_id') > 0 ? form.watch('township_id').toString() : undefined} onValueChange={(value) => {
                        const numeric = Number(value);
                        form.setValue('township_id', Number.isFinite(numeric) && numeric > 0 ? numeric : 0);
                      }} disabled={!watchedRegionId}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('createAdvertisement.selectTownship')} />
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
                  <FormField name="address" label={t('createAdvertisement.address')} error={errors.address} required>
                    <Input {...form.register('address')} placeholder={t('createAdvertisement.addressPlaceholder')} />
                  </FormField>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    {t('createAdvertisement.contactInformation')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField name="contact_name" label={t('createAdvertisement.contactName')} error={errors.contact_name} required>
                      <Input {...form.register('contact_name')} placeholder={t('createAdvertisement.contactNamePlaceholder')} />
                    </FormField>
                    <FormField name="email" label={t('createAdvertisement.email')} error={errors.email}>
                      <Input {...form.register('email')} type="email" placeholder={t('createAdvertisement.emailPlaceholder')} autoComplete="email" />
                    </FormField>
                  </div>

                  <FormField name="phone_numbers" label={t('createAdvertisement.phoneNumbers')} error={errors.phone_numbers} required>
                    <div className="space-y-2">
                      {phoneNumbers.map((phone, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex gap-2">
                            <Input value={phone} onChange={(e) => updatePhoneNumber(index, e.target.value)} placeholder="e.g., +959445566778" className="flex-1" inputMode="tel" autoComplete="tel" />
                            {phoneNumbers.length > 1 && (
                              <Button type="button" variant="outline" size="sm" onClick={() => removePhoneNumber(index)} className="px-3">
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          {phoneErrors[index] && (<p className="text-xs text-red-500">{phoneErrors[index]}</p>)}
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={addPhoneNumber} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        {t('createAdvertisement.addPhoneNumber')}
                      </Button>
                    </div>
                  </FormField>
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
                      onUploadComplete={handleMediaUploadComplete} 
                      onUploadError={handleMediaError} 
                      maxFiles={5}
                      initialFiles={(advData?.data?.media?.images || []).map(img => ({
                        id: img.id,
                        url: img.url,
                        filename: img.filename,
                        type: 'image' as const,
                        size: 0,
                      }))}
                    />
                    {errors.media_ids && (<p className="text-sm text-red-500">{errors.media_ids.message}</p>)}
                  </div>
                </CardContent>
              </Card>

              {/* Status */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-primary" />
                    {t('createAdvertisement.status')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField name="status" label={t('createAdvertisement.status')} error={errors.status} required>
                    <Select value={form.watch('status') || 'draft'} onValueChange={(value) => form.setValue('status', value as 'draft' | 'published')}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('createAdvertisement.status')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">{t('createAdvertisement.draft')}</SelectItem>
                        <SelectItem value="published">{t('createAdvertisement.published')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>
                </CardContent>
              </Card>

              {/* Submit */}
              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex justify-end gap-4">
                    <Button type="submit" disabled={updateMutation.isPending} className="gradient-primary">
                      {updateMutation.isPending ? t('createAdvertisement.creating') : t('appointments.update')}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                      {t('createAdvertisement.cancel')}
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


