import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, User, Phone, Image, Trash2 } from 'lucide-react';
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
import { useUpdateShareProfitListing, useDeleteShareProfitListing } from '@/hooks/mutations';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useMyShareProfitListing } from '@/hooks/queries/useMyShareProfitListings';
import { useFormValidation } from '@/hooks/useFormValidation';
import { createShareProfitListingSchema } from '@/lib/validation';
import { FormField } from '@/components/forms';
import type { ShareProfitUpdateData, ShareProfitWantedType } from '@/types/shareProfitListing';

export default function EditShareProfitListing() {
  const { id: slug } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const seo = seoUtils.getPageSEO('createShareProfitList');
  const { t, language } = useLanguage();
  const [mediaIds, setMediaIds] = useState<number[]>([]);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [initialMediaFiles, setInitialMediaFiles] = useState<Array<{
    id: number;
    url: string;
    filename: string;
    type: 'image' | 'video';
    size?: number;
  }>>([]);

  const { data: listingResponse, isLoading: listingLoading } = useMyShareProfitListing(slug || '');
  const listing = listingResponse?.data?.data;

  const { data: regionsData, isLoading: regionsLoading } = useRegions();
  const { data: townshipsData, isLoading: townshipsLoading } = useTownships();
  const { data: propertyTypesData, isLoading: propertyTypesLoading } = usePropertyTypes();
  const updateMutation = useUpdateShareProfitListing();
  const deleteMutation = useDeleteShareProfitListing();
  const { showSuccess, showError } = useModal();
  const { isOpen: isConfirmOpen, options: confirmOptions, isLoading: isConfirmLoading, showConfirm, hideConfirm, handleConfirm } = useConfirmModal();
  const { form, errors } = useFormValidation(createShareProfitListingSchema);
  const formInitializedRef = useRef(false);
  const [formReady, setFormReady] = useState(false);

  const isLoading = regionsLoading || townshipsLoading || propertyTypesLoading || listingLoading;
  const regions = regionsData?.data || [];
  const townships = townshipsData?.data || [];
  const propertyTypes = propertyTypesData?.data || [];
  const watchedRegionId = form.watch('prefer_region_id');
  const availableTownships = townships.filter((township) => township.region_id === watchedRegionId);

  /** Reset init flags when navigating to another listing (or re-entering edit). */
  useEffect(() => {
    formInitializedRef.current = false;
    setFormReady(false);
    setMediaIds([]);
    setInitialMediaFiles([]);
  }, [slug]);

  /**
   * Fill form with form.reset() then show form.
   * Select fields must mount with values already set — setValue after mount leaves Radix Select blank on re-visit.
   */
  useEffect(() => {
    if (
      !listing ||
      regions.length === 0 ||
      propertyTypes.length === 0 ||
      townships.length === 0 ||
      formInitializedRef.current
    ) {
      return;
    }

    const regionId = listing.preferred_location.region.id;
    const townshipId = listing.preferred_location.township.id;
    const townshipExists = townships.some(
      (t) => t.id === townshipId && t.region_id === regionId
    );

    const images = listing.media?.images || [];
    const ids = images.map((m) => m.id);

    form.reset({
      wanted_type: listing.wanted_type,
      property_type_id: listing.property_type.id,
      title: listing.title || '',
      description: listing.description || '',
      prefer_region_id: regionId,
      prefer_township_id: townshipExists ? townshipId : undefined,
      min_budget: listing.budget.min_budget ? Number(listing.budget.min_budget) : undefined,
      max_budget: listing.budget.max_budget ? Number(listing.budget.max_budget) : undefined,
      bedrooms: listing.specifications.bedrooms ?? undefined,
      bathrooms: listing.specifications.bathrooms ?? undefined,
      min_area: listing.specifications.min_area ? Number(listing.specifications.min_area) : undefined,
      max_area: listing.specifications.max_area ? Number(listing.specifications.max_area) : undefined,
      name: listing.contact.name || '',
      phone: listing.contact.phone || '',
      email: listing.contact.email || '',
      additional_requirement: listing.additional_requirement || '',
      media_ids: ids,
    } as ShareProfitUpdateData);

    if (images.length > 0) {
      setInitialMediaFiles(
        images.map((m) => ({
          id: m.id,
          url: m.url || m.medium_url || m.small_url || m.thumbnail_url || '',
          filename: m.filename || 'photo',
          type: 'image' as const,
          size: 0,
        }))
      );
      setMediaIds(ids);
    }

    formInitializedRef.current = true;
    setFormReady(true);
  }, [listing, regions, propertyTypes, townships, form]);

  useEffect(() => {
    form.setValue('media_ids', mediaIds, { shouldValidate: mediaIds.length > 0 });
  }, [mediaIds, form]);

  const onSubmit = (data: ShareProfitUpdateData) => {
    if (!slug) return;

    const updateData: ShareProfitUpdateData = {
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
      media_ids: mediaIds,
    };

    updateMutation.mutate(
      { slug, data: updateData },
      {
        onSuccess: (response) => {
          showSuccess(
            language === 'mm' ? 'စာရင်း ပြင်ဆင်ပြီးပါပြီ။' : 'Listing updated successfully.',
            t('editWantedList.successTitle')
          );
          const nextSlug = response.data?.data?.slug || slug;
          setTimeout(() => navigate(`/my-share-profit-listings/detail/${nextSlug}`), 1500);
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
          showError(error?.response?.data?.message || error.message, t('editWantedList.errorTitle'));
        },
      }
    );
  };

  const handleDelete = () => {
    if (!slug) return;
    if (listing?.status?.is_active) {
      showError(
        language === 'mm'
          ? 'အသက်ဝင်နေသော စာရင်းကို ဖျက်၍မရပါ။ အရင် ပိတ်ပါ။'
          : 'Active listing cannot be deleted. Please deactivate first.',
        language === 'mm' ? 'ဖျက်မရပါ' : 'Cannot delete'
      );
      return;
    }

    showConfirm({
      title: t('editWantedList.confirmDeleteTitle') || 'Confirm Delete',
      message: language === 'mm'
        ? 'ဤအကျိုးတူရ စာရင်းကို ဖျက်မှာ သေချာပါသလား။'
        : 'Are you sure you want to delete this share profit listing?',
      confirmText: t('myWantedList.delete'),
      cancelText: t('editWantedList.cancel') || 'Cancel',
      confirmVariant: 'destructive',
      onConfirm: () => {
        return new Promise((resolve, reject) => {
          deleteMutation.mutate(slug, {
            onSuccess: () => {
              showSuccess(
                language === 'mm' ? 'စာရင်း ဖျက်ပြီးပါပြီ။' : 'Listing deleted successfully.',
                t('editWantedList.deleteSuccessTitle') || 'Success!'
              );
              setTimeout(() => navigate('/my-share-profit-listings/list'), 1500);
              resolve();
            },
            onError: (err: Error) => {
              showError(err.message, t('editWantedList.errorTitle'));
              reject(err);
            },
          });
        });
      },
    });
  };

  const handleRegionChange = (value: string) => {
    form.setValue('prefer_region_id', parseInt(value, 10));
    form.setValue('prefer_township_id', 0);
  };

  return (
    <>
      <SEOHead seo={seo} path={`/my-share-profit-listings/edit/${slug}`} />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                {language === 'mm' ? 'အကျိုးတူရ စာရင်း ပြင်ဆင်ရန်' : 'Edit Share Profit Listing'}
              </h1>
            </div>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                {t('myWantedList.delete')}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('createWantedList.back')}
              </Button>
            </div>
          </div>

          {isLoading || !listing || !formReady ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <form key={slug} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        value={form.watch('wanted_type') || ''}
                        onValueChange={(value) => form.setValue('wanted_type', value as ShareProfitWantedType)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="buyer">{t('myWantedList.buyer')}</SelectItem>
                          <SelectItem value="renter">{t('myWantedList.renter')}</SelectItem>
                          <SelectItem value="seller">{t('search.seller') || 'Seller'}</SelectItem>
                          <SelectItem value="share_profit">{t('search.shareProfit')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                    <FormField name="property_type_id" label={t('createWantedList.propertyType')} error={errors.property_type_id} required>
                      <Select
                        value={form.watch('property_type_id')?.toString() || ''}
                        onValueChange={(value) => form.setValue('property_type_id', parseInt(value, 10))}
                      >
                        <SelectTrigger>
                          <SelectValue />
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
                    <Input {...form.register('title')} />
                  </FormField>
                  <FormField name="description" label={t('createWantedList.descriptionLabel')} error={errors.description}>
                    <Textarea {...form.register('description')} rows={4} />
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
                      <Select value={form.watch('prefer_region_id')?.toString() || ''} onValueChange={handleRegionChange}>
                        <SelectTrigger>
                          <SelectValue />
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
                    <FormField name="prefer_township_id" label={t('createWantedList.township')} error={errors.prefer_township_id} required>
                      <Select
                        value={form.watch('prefer_township_id')?.toString() || ''}
                        onValueChange={(value) => form.setValue('prefer_township_id', parseInt(value, 10))}
                        disabled={!watchedRegionId}
                      >
                        <SelectTrigger>
                          <SelectValue />
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
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-primary" />
                    {t('createWantedList.budgetPropertySpecs')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField name="min_budget" label={t('createWantedList.minBudget')} error={errors.min_budget}>
                      <Input {...form.register('min_budget')} type="number" />
                    </FormField>
                    <FormField name="max_budget" label={t('createWantedList.maxBudget')} error={errors.max_budget}>
                      <Input {...form.register('max_budget')} type="number" />
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
                            <SelectItem key={n} value={String(n)}>{n === 0 ? t('createWantedList.any') : n}</SelectItem>
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
                            <SelectItem key={n} value={String(n)}>{n === 0 ? t('createWantedList.any') : n}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormField>
                    <FormField name="min_area" label={t('createWantedList.minArea')} error={errors.min_area}>
                      <Input {...form.register('min_area')} type="number" />
                    </FormField>
                    <FormField name="max_area" label={t('createWantedList.maxArea')} error={errors.max_area}>
                      <Input {...form.register('max_area')} type="number" />
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
                    <MediaUpload
                      initialFiles={initialMediaFiles}
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
                      <Input {...form.register('phone')} />
                    </FormField>
                    <FormField name="email" label={t('createWantedList.emailAddress')} error={errors.email}>
                      <Input {...form.register('email')} type="email" />
                    </FormField>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-primary" />
                    {t('createWantedList.additionalRequirements')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField name="additional_requirement" label={t('createWantedList.specialRequirements')} error={errors.additional_requirement}>
                    <Textarea {...form.register('additional_requirement')} rows={3} />
                  </FormField>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex justify-end gap-4">
                    <Button
                      type="submit"
                      disabled={updateMutation.isPending || isMediaLoading}
                      className="gradient-primary"
                    >
                      {updateMutation.isPending
                        ? (language === 'mm' ? 'သိမ်းနေသည်...' : 'Saving...')
                        : (language === 'mm' ? 'ပြောင်းလဲမှုများ သိမ်းမည်' : 'Save Changes')}
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

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={hideConfirm}
        onConfirm={handleConfirm}
        title={confirmOptions?.title || ''}
        message={confirmOptions?.message || ''}
        confirmText={confirmOptions?.confirmText}
        cancelText={confirmOptions?.cancelText}
        confirmVariant={confirmOptions?.confirmVariant}
        isLoading={isConfirmLoading}
      />
    </>
  );
}
