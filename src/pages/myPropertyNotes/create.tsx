import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SEOHead } from '@/components/seo/SEOHead';
import { MediaUpload } from '@/components/MediaUpload';
import { MapLocationPicker } from '@/components/MapLocationPicker';
import { FormField } from '@/components/forms';
import { seoUtils } from '@/lib/seo';
import { createPropertyNoteSchema } from '@/lib/validation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useModal } from '@/contexts/ModalContext';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useRegions, useTownships } from '@/hooks/queries/useLocations';
import { useListingTypes } from '@/hooks/queries/useProperties';
import { usePropertyNoteAccess } from '@/hooks/queries/usePropertyNotes';
import { useCreatePropertyNote } from '@/hooks/mutations/usePropertyNoteMutations';
import { PropertyNotePageHeader } from './components/PropertyNotePageHeader';
import type { PropertyNoteCreateData } from '@/types/propertyNote';
import type { PropertyNoteFormData } from '@/lib/validation/propertyNote';

/**
 * Create Property Note — location + photos required.
 */
export default function CreatePropertyNotePage() {
  const navigate = useNavigate();
  const seo = seoUtils.getPageSEO('myPropertyNotesCreate');
  const { language, t } = useLanguage();
  const mm = language === 'mm';
  const { showSuccess, showError } = useModal();
  const [mediaIds, setMediaIds] = useState<number[]>([]);
  const [isMediaLoading, setIsMediaLoading] = useState(false);

  const { data: accessResponse, isLoading: accessLoading } = usePropertyNoteAccess();
  const isAllowed = Boolean(accessResponse?.data?.data?.is_allowed);

  const { data: regionsData } = useRegions();
  const { data: townshipsData } = useTownships();
  const { data: listingTypesResp } = useListingTypes();
  const createMutation = useCreatePropertyNote();
  const { form, errors } = useFormValidation(createPropertyNoteSchema);

  const regions = regionsData?.data || [];
  const allTownships = townshipsData?.data || [];
  const listingTypes = useMemo(() => {
    const all = listingTypesResp?.data || [];
    return all.filter((lt) => lt.slug === 'for-sale' || lt.slug === 'for-rent');
  }, [listingTypesResp?.data]);

  const watchedRegionId = form.watch('region_id');
  const availableTownships = allTownships.filter(
    (township) => township.region_id === Number(watchedRegionId)
  );

  useEffect(() => {
    form.setValue('media_ids', mediaIds, { shouldValidate: mediaIds.length > 0 });
  }, [mediaIds, form]);

  const onSubmit = (data: PropertyNoteFormData) => {
    const payload: PropertyNoteCreateData = {
      listing_type_id: data.listing_type_id,
      region_id: data.region_id,
      township_id: data.township_id,
      ward: data.ward || null,
      road: data.road || null,
      length_ft: data.length_ft ?? null,
      width_ft: data.width_ft ?? null,
      latitude: data.latitude,
      longitude: data.longitude,
      media_ids: mediaIds,
    };

    createMutation.mutate(payload, {
      onSuccess: (res) => {
        const created = res.data?.data;
        showSuccess(
          mm ? 'မှတ်စု ဖန်တီးပြီးပါပြီ။' : 'Property note created.',
          mm ? 'အောင်မြင်ပါသည်' : 'Success'
        );
        navigate(created?.id ? `/my-property-notes/${created.id}` : '/my-property-notes/list');
      },
      onError: (err: Error & { response?: { data?: { message?: string } } }) => {
        showError(
          err?.response?.data?.message || err.message || (mm ? 'ဖန်တီး၍မရပါ' : 'Create failed'),
          mm ? 'အမှား' : 'Error'
        );
      },
    });
  };

  if (!accessLoading && accessResponse?.data?.data && !isAllowed) {
    return <Navigate to="/my-property-notes" replace />;
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-6 max-w-6xl">
      <SEOHead seo={seo} path="/my-property-notes/create" />

      <PropertyNotePageHeader
        title={mm ? 'မှတ်စု အသစ်' : 'Create Property Note'}
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{mm ? 'အခြေခံ အချက်အလက်' : 'Basic info'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              name="listing_type_id"
              label={mm ? 'အမျိုးအစား' : 'Listing type'}
              required
              error={errors.listing_type_id}
            >
              <Select
                value={form.watch('listing_type_id') ? String(form.watch('listing_type_id')) : undefined}
                onValueChange={(value) =>
                  form.setValue('listing_type_id', Number(value), { shouldValidate: true })
                }
              >
                <SelectTrigger className={errors.listing_type_id ? 'border-red-500' : ''}>
                  <SelectValue placeholder={mm ? 'ရွေးချယ်ပါ' : 'Select'} />
                </SelectTrigger>
                <SelectContent>
                  {listingTypes.map((lt) => (
                    <SelectItem key={lt.id} value={String(lt.id)}>
                      {mm ? lt.name_mm : lt.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField name="region_id" label={mm ? 'တိုင်း/ပြည်နယ်' : 'Region'} required error={errors.region_id}>
                <Select
                  value={form.watch('region_id') ? String(form.watch('region_id')) : undefined}
                  onValueChange={(value) => {
                    form.setValue('region_id', Number(value), { shouldValidate: true });
                    form.setValue('township_id', undefined as unknown as number);
                  }}
                >
                  <SelectTrigger className={errors.region_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder={mm ? 'ရွေးချယ်ပါ' : 'Select'} />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.id} value={String(region.id)}>
                        {mm ? region.name_mm : region.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField name="township_id" label={mm ? 'မြို့နယ်' : 'Township'} required error={errors.township_id}>
                <Select
                  value={form.watch('township_id') ? String(form.watch('township_id')) : undefined}
                  onValueChange={(value) =>
                    form.setValue('township_id', Number(value), { shouldValidate: true })
                  }
                  disabled={!watchedRegionId}
                >
                  <SelectTrigger className={errors.township_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder={mm ? 'ရွေးချယ်ပါ' : 'Select'} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTownships.map((township) => (
                      <SelectItem key={township.id} value={String(township.id)}>
                        {mm ? township.name_mm : township.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField name="ward" label={mm ? 'ရပ်ကွက်' : 'Ward'} error={errors.ward}>
                <Input {...form.register('ward')} />
              </FormField>
              <FormField name="road" label={mm ? 'လမ်း' : 'Road'} error={errors.road}>
                <Input {...form.register('road')} />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField name="length_ft" label={mm ? 'အလျား (ft)' : 'Length (ft)'} error={errors.length_ft}>
                <Input type="number" step="any" {...form.register('length_ft')} />
              </FormField>
              <FormField name="width_ft" label={mm ? 'အနံ (ft)' : 'Width (ft)'} error={errors.width_ft}>
                <Input type="number" step="any" {...form.register('width_ft')} />
              </FormField>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{mm ? 'မြေပုံ တည်နေရာ' : 'Map location'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(errors.latitude || errors.longitude) && (
              <p className="text-sm text-red-500">
                {errors.latitude?.message || errors.longitude?.message}
              </p>
            )}
            <MapLocationPicker
              variant="inline"
              mapHeightClassName="h-[55vh] min-h-[400px]"
              latitude={form.watch('latitude')}
              longitude={form.watch('longitude')}
              onLocationSelect={(lat, lng) => {
                form.setValue('latitude', lat, { shouldValidate: true });
                form.setValue('longitude', lng, { shouldValidate: true });
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{mm ? 'ဓာတ်ပုံများ' : 'Photos'}</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField name="media_ids" label={t('common.photos') || (mm ? 'ဓာတ်ပုံ' : 'Photos')} required error={errors.media_ids}>
              <MediaUpload
                acceptedTypes={['image/*']}
                maxFiles={10}
                onUploadComplete={setMediaIds}
                onUploadError={(msg) => showError(msg, mm ? 'အမှား' : 'Error')}
                onLoadingChange={setIsMediaLoading}
              />
            </FormField>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" disabled={createMutation.isPending || isMediaLoading}>
            {createMutation.isPending
              ? mm
                ? 'သိမ်းနေသည်…'
                : 'Saving…'
              : mm
                ? 'သိမ်းမည်'
                : 'Save note'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link to="/my-property-notes/list">{mm ? 'ပယ်ဖျက်' : 'Cancel'}</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
