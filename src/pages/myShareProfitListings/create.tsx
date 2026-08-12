import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, User, Phone, Image } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { MediaUpload } from '@/components/MediaUpload';
import { useRegions, useTownships } from '@/hooks/queries/useLocations';
import { usePropertyTypes } from '@/hooks/queries/usePropertyTypes';
import { useLanguage } from '@/contexts/LanguageContext';
import { useModal } from '@/contexts/ModalContext';
import { useCreateShareProfitListing } from '@/hooks/mutations';
import { useFormValidation } from '@/hooks/useFormValidation';
import { createShareProfitListingSchema } from '@/lib/validation';
import { FormField } from '@/components/forms';
import type { ShareProfitCreateData, ShareProfitWantedType } from '@/types/shareProfitListing';

export default function CreateShareProfitListing() {
  const navigate = useNavigate();
  const seo = seoUtils.getPageSEO('createShareProfitList');
  const { t, language } = useLanguage();
  const [mediaIds, setMediaIds] = useState<number[]>([]);
  const [isMediaLoading, setIsMediaLoading] = useState(false);

  const { data: regionsData, isLoading: regionsLoading } = useRegions();
  const { data: townshipsData, isLoading: townshipsLoading } = useTownships();
  const { data: propertyTypesData, isLoading: propertyTypesLoading } = usePropertyTypes();
  const createMutation = useCreateShareProfitListing();
  const { showSuccess, showError } = useModal();
  const { form, errors } = useFormValidation(createShareProfitListingSchema);

  const isLoading = regionsLoading || townshipsLoading || propertyTypesLoading;
  const regions = regionsData?.data || [];
  const townships = townshipsData?.data || [];
  const propertyTypes = propertyTypesData?.data || [];
  const watchedRegionId = form.watch('prefer_region_id');
  const availableTownships = townships.filter((township) => township.region_id === watchedRegionId);

  useEffect(() => {
    if (!form.getValues('media_ids')) {
      form.setValue('media_ids', []);
    }
  }, [form]);

  useEffect(() => {
    form.setValue('media_ids', mediaIds, { shouldValidate: mediaIds.length > 0 });
  }, [mediaIds, form]);

  const onSubmit = (data: ShareProfitCreateData) => {
    const createData: ShareProfitCreateData = {
      wanted_type: data.wanted_type,
      property_type_id: data.property_type_id,
      title: data.title,
      prefer_region_id: data.prefer_region_id,
      prefer_township_id: data.prefer_township_id || undefined,
      name: data.name,
      phone: data.phone,
      description: data.description || undefined,
      min_budget: data.min_budget || undefined,
      max_budget: data.max_budget || undefined,
      bedrooms: data.bedrooms || undefined,
      bathrooms: data.bathrooms || undefined,
      min_area: data.min_area || undefined,
      max_area: data.max_area || undefined,
      address: data.address || undefined,
      email: data.email || undefined,
      status: 'published',
      media_ids: mediaIds,
    };

    createMutation.mutate(createData, {
      onSuccess: (response) => {
        showSuccess(
          language === 'mm' ? 'အကျိုးတူရ စာရင်း ဖန်တီးပြီးပါပြီ။' : 'Share profit listing created successfully.',
          t('createWantedList.successTitle')
        );
        const slug = response.data?.data?.slug;
        setTimeout(() => {
          navigate(slug ? `/my-share-profit-listings/detail/${slug}` : '/my-share-profit-listings/list');
        }, 1500);
      },
      onError: (error: Error & { response?: { data?: { message?: string } } }) => {
        const errorMessage = error?.response?.data?.message || error?.message || t('createWantedList.errorMessage');
        showError(errorMessage, t('createWantedList.errorTitle'));
      },
    });
  };

  const handleRegionChange = (value: string) => {
    form.setValue('prefer_region_id', parseInt(value, 10));
    form.setValue('prefer_township_id', undefined);
  };

  return (
    <>
      <SEOHead seo={seo} path="/my-share-profit-listings/create" />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                {language === 'mm' ? 'အကျိုးတူရ စာရင်း ဖန်တီးရန်' : 'Create Partnership Post'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {language === 'mm' ? 'အကျိုးတူရ အိမ်ခြံမြေ လိုအပ်ချက်ကို တင်ပါ' : 'Post your partnership property requirement'}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('createWantedList.back')}
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-primary" />
                    {t('createWantedList.basicInformation')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField name="wanted_type" label={t('createWantedList.iAmA')} error={errors.wanted_type} required>
                      <Select
                        value={form.watch('wanted_type')}
                        onValueChange={(value) => form.setValue('wanted_type', value as ShareProfitWantedType)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('createWantedList.selectType')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="buyer">{t('myWantedList.buyer')}</SelectItem>
                          <SelectItem value="seller">{t('search.seller') || 'Seller'}</SelectItem>
                          <SelectItem value="for_rent">{t('search.partnershipForRent') || 'For Rent'}</SelectItem>
                          <SelectItem value="renter">{t('myWantedList.renter')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>

                    <FormField name="property_type_id" label={t('createWantedList.propertyType')} error={errors.property_type_id} required>
                      <Select
                        value={form.watch('property_type_id')?.toString()}
                        onValueChange={(value) => form.setValue('property_type_id', parseInt(value, 10))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('createWantedList.selectPropertyType')} />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {language === 'mm' ? type.name_mm : type.name_en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>

                  <FormField name="title" label={t('createWantedList.titleLabel')} error={errors.title} required>
                    <Input {...form.register('title')} placeholder={t('createWantedList.titlePlaceholder')} />
                  </FormField>

                  <FormField name="description" label={t('createWantedList.descriptionLabel')} error={errors.description}>
                    <Textarea {...form.register('description')} placeholder={t('createWantedList.descriptionPlaceholder')} rows={4} />
                  </FormField>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                    {t('createWantedList.preferredLocation')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField name="prefer_region_id" label={t('createWantedList.region')} error={errors.prefer_region_id} required>
                      <Select value={form.watch('prefer_region_id')?.toString()} onValueChange={handleRegionChange}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('createWantedList.selectRegion')} />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region.id} value={region.id.toString()}>
                              {language === 'mm' ? region.name_mm : region.name_en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>

                    <FormField name="prefer_township_id" label={t('createWantedList.township')} error={errors.prefer_township_id}>
                      <Select
                        value={form.watch('prefer_township_id')?.toString() || ''}
                        onValueChange={(value) => form.setValue('prefer_township_id', value ? parseInt(value, 10) : undefined)}
                        disabled={!watchedRegionId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('createWantedList.selectTownship')} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTownships.map((township) => (
                            <SelectItem key={township.id} value={township.id.toString()}>
                              {language === 'mm' ? township.name_mm : township.name_en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>
                  <FormField name="address" label={t('createWantedList.address')} error={errors.address}>
                    <Textarea {...form.register('address')} rows={2} placeholder={t('createWantedList.addressPlaceholder')} />
                  </FormField>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-primary" />
                    {t('createWantedList.budgetPropertySpecs')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField name="min_budget" label={t('createWantedList.minBudget')} error={errors.min_budget}>
                      <Input {...form.register('min_budget')} type="number" placeholder="e.g., 50000000" />
                    </FormField>
                    <FormField name="max_budget" label={t('createWantedList.maxBudget')} error={errors.max_budget}>
                      <Input {...form.register('max_budget')} type="number" placeholder="e.g., 80000000" />
                    </FormField>
                    <FormField name="bedrooms" label={t('createWantedList.bedrooms')} error={errors.bedrooms}>
                      <Select
                        value={form.watch('bedrooms')?.toString()}
                        onValueChange={(value) => form.setValue('bedrooms', parseInt(value, 10))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('createWantedList.any')} />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2, 3, 4, 5].map((n) => (
                            <SelectItem key={n} value={String(n)}>{n === 0 ? t('createWantedList.any') : n === 5 ? '5+' : n}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                    <FormField name="bathrooms" label={t('createWantedList.bathrooms')} error={errors.bathrooms}>
                      <Select
                        value={form.watch('bathrooms')?.toString()}
                        onValueChange={(value) => form.setValue('bathrooms', parseInt(value, 10))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('createWantedList.any')} />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2, 3, 4, 5].map((n) => (
                            <SelectItem key={n} value={String(n)}>{n === 0 ? t('createWantedList.any') : n === 5 ? '5+' : n}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                    <FormField name="min_area" label={t('createWantedList.minArea')} error={errors.min_area}>
                      <Input {...form.register('min_area')} type="number" placeholder="e.g., 1200" />
                    </FormField>
                    <FormField name="max_area" label={t('createWantedList.maxArea')} error={errors.max_area}>
                      <Input {...form.register('max_area')} type="number" placeholder="e.g., 2000" />
                    </FormField>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Image className="h-5 w-5 text-primary" />
                    {language === 'mm' ? 'ဓာတ်ပုံများ' : 'Photos'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField name="media_ids" label="" error={errors.media_ids} required>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {language === 'mm' ? 'အနည်းဆုံး ဓာတ်ပုံ တစ်ပုံ တင်ပါ။' : 'Upload at least one photo.'}
                      </p>
                      <MediaUpload
                        onUploadComplete={(ids) => {
                          setMediaIds(ids);
                          form.setValue('media_ids', ids, { shouldValidate: true });
                        }}
                        onUploadError={(msg) => showError(msg, t('common.error'))}
                        onLoadingChange={setIsMediaLoading}
                        maxFiles={8}
                        acceptedTypes={['image/*']}
                        className="min-h-[280px]"
                      />
                      <input type="hidden" {...form.register('media_ids')} />
                    </div>
                  </FormField>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    {t('createWantedList.contactInformation')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField name="name" label={t('createWantedList.fullName')} error={errors.name} required>
                      <Input {...form.register('name')} />
                    </FormField>
                    <FormField name="phone" label={t('createWantedList.phoneNumber')} error={errors.phone} required>
                      <Input {...form.register('phone')} placeholder="e.g., 09123456789" />
                    </FormField>
                    <FormField name="email" label={t('createWantedList.emailAddress')} error={errors.email}>
                      <Input {...form.register('email')} type="email" />
                    </FormField>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex justify-end gap-4">
                    <Button
                      type="submit"
                      disabled={createMutation.isPending || isMediaLoading}
                      className="gradient-primary shadow-lg shadow-primary/30"
                    >
                      {createMutation.isPending ? t('createWantedList.creating') : t('createWantedList.createListing')}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>
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
