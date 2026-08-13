import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo/SEOHead';
import { MediaUpload } from '@/components/MediaUpload';
import { FormField } from '@/components/forms';
import { seoUtils } from '@/lib/seo';
import { useFormValidation } from '@/hooks/useFormValidation';
import { activityFormSchema, type ActivityFormValues } from '@/lib/validation/activity';
import { useCreateActivity, useUpdateActivity, useDeleteActivity } from '@/hooks/mutations/useActivityMutations';
import { useLanguage } from '@/contexts/LanguageContext';
import { useModal } from '@/contexts/ModalContext';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { pointSettingsApi, type PointSettings } from '@/services/api/pointSettings';
import type { Activity, ActivityCreateData, ActivityStatus } from '@/types/activity';

type ActivityFormMode = 'create' | 'edit';

interface ActivityFormPageProps {
  mode: ActivityFormMode;
  activity?: Activity;
  slug?: string;
  isLoading?: boolean;
}

const MAX_IMAGES = 10;

export function ActivityFormPage({ mode, activity, slug, isLoading = false }: ActivityFormPageProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { showSuccess, showError } = useModal();
  const { form, errors } = useFormValidation<ActivityFormValues>(activityFormSchema);
  const createMutation = useCreateActivity();
  const updateMutation = useUpdateActivity();
  const deleteMutation = useDeleteActivity();
  const {
    isOpen: isConfirmOpen,
    options: confirmOptions,
    isLoading: isConfirmLoading,
    showConfirm,
    hideConfirm,
    handleConfirm,
  } = useConfirmModal();

  const [mediaIds, setMediaIds] = useState<number[]>([]);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [initialMediaFiles, setInitialMediaFiles] = useState<Array<{
    id: number;
    url: string;
    filename: string;
    type: 'image' | 'video';
    size?: number;
  }>>([]);
  const [pointSettings, setPointSettings] = useState<PointSettings | null>(null);
  const [originalStatus, setOriginalStatus] = useState<ActivityStatus>('draft');
  const formInitializedRef = useRef(false);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const uploadPointCost = pointSettings?.upload_activity_info?.point_amount || 0;

  useEffect(() => {
    pointSettingsApi.getPointSettings()
      .then((response) => {
        const data = (response as any)?.data?.data || (response as any)?.data;
        if (data) setPointSettings(data);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (mode !== 'edit' || !activity || formInitializedRef.current) return;

    const images = activity.media?.images || [];
    const ids = images.map((image) => image.id);

    form.reset({
      title: activity.title || '',
      description: activity.description || '',
      status: activity.status || 'draft',
      media_ids: ids,
    });
    setOriginalStatus(activity.status || 'draft');
    setMediaIds(ids);
    setInitialMediaFiles(
      images.map((image) => ({
        id: image.id,
        url: image.url || image.medium_url || image.small_url || image.thumbnail_url || '',
        filename: image.filename || 'photo',
        type: 'image' as const,
        size: 0,
      }))
    );
    formInitializedRef.current = true;
  }, [activity, form, mode]);

  useEffect(() => {
    if (mode === 'create' && !formInitializedRef.current) {
      form.reset({
        title: '',
        description: '',
        status: 'draft',
        media_ids: [],
      });
      formInitializedRef.current = true;
    }
  }, [form, mode]);

  useEffect(() => {
    form.setValue('media_ids', mediaIds, { shouldValidate: mediaIds.length > 0 || form.formState.isSubmitted });
  }, [form, mediaIds]);

  const needsPointCharge = (nextStatus: ActivityStatus) => {
    if (nextStatus !== 'published' || uploadPointCost <= 0) return false;
    if (mode === 'create') return true;
    return originalStatus !== 'published';
  };

  const submitPayload = (data: ActivityFormValues) => {
    const payload: ActivityCreateData = {
      title: data.title.trim(),
      description: data.description.trim(),
      status: data.status || 'draft',
      media_ids: mediaIds,
    };

    return new Promise<void>((resolve, reject) => {
      if (mode === 'create') {
        createMutation.mutate(payload, {
          onSuccess: () => {
            showSuccess(t('myActivities.createSuccess'), t('createWantedList.successTitle'));
            navigate('/my-activities/list');
            resolve();
          },
          onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            showError(
              error?.response?.data?.message || error.message || t('myActivities.saveError'),
              t('createWantedList.errorTitle')
            );
            reject(error);
          },
        });
        return;
      }

      if (!slug) {
        reject(new Error('Missing activity slug'));
        return;
      }

      updateMutation.mutate(
        { slug, data: payload },
        {
          onSuccess: () => {
            showSuccess(t('myActivities.updateSuccess'), t('createWantedList.successTitle'));
            navigate('/my-activities/list');
            resolve();
          },
          onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            showError(
              error?.response?.data?.message || error.message || t('myActivities.saveError'),
              t('createWantedList.errorTitle')
            );
            reject(error);
          },
        }
      );
    });
  };

  const onSubmit = (data: ActivityFormValues) => {
    if (needsPointCharge(data.status)) {
      showConfirm({
        title: t('myActivities.publishConfirmTitle') || (language === 'mm' ? 'ထုတ်ဝေရန် အတည်ပြုပါ' : 'Confirm publish'),
        message:
          language === 'mm'
            ? `ဤလုပ်ငန်းလှုပ်ရှားမှုကို ထုတ်ဝေပါက ${uploadPointCost} ပွိုင့် ကုန်ကျပါမည်။ ဆက်လုပ်မှာ သေချာပါသလား။`
            : `Publishing this activity will cost ${uploadPointCost} points. Do you want to continue?`,
        confirmText: t('myActivities.publish') || (language === 'mm' ? 'ထုတ်ဝေရန်' : 'Publish'),
        cancelText: t('createWantedList.cancel') || 'Cancel',
        onConfirm: () => submitPayload(data),
      });
      return;
    }

    submitPayload(data);
  };

  const handleDelete = () => {
    if (!slug) return;

    showConfirm({
      title: t('myActivities.deleteConfirmTitle') || (language === 'mm' ? 'ဖျက်ရန် အတည်ပြုပါ' : 'Confirm delete'),
      message:
        language === 'mm'
          ? 'ဤလုပ်ငန်းလှုပ်ရှားမှုကို ဖျက်မှာ သေချာပါသလား။'
          : 'Are you sure you want to delete this activity?',
      confirmText: t('myWantedList.delete'),
      cancelText: t('createWantedList.cancel') || 'Cancel',
      confirmVariant: 'destructive',
      onConfirm: () =>
        new Promise<void>((resolve, reject) => {
          deleteMutation.mutate(slug, {
            onSuccess: () => {
              showSuccess(
                t('myActivities.deleteSuccess') || (language === 'mm' ? 'ဖျက်ပြီးပါပြီ။' : 'Activity deleted successfully.'),
                t('createWantedList.successTitle')
              );
              navigate('/my-activities/list');
              resolve();
            },
            onError: (error: Error & { response?: { data?: { message?: string } } }) => {
              showError(
                error?.response?.data?.message || error.message || t('myActivities.deleteError'),
                t('createWantedList.errorTitle')
              );
              reject(error);
            },
          });
        }),
    });
  };

  const pageTitle =
    mode === 'create'
      ? t('myActivities.createTitle') || (language === 'mm' ? 'လုပ်ငန်းလှုပ်ရှားမှု ဖန်တီးရန်' : 'Create Activity')
      : t('myActivities.editTitle') || (language === 'mm' ? 'လုပ်ငန်းလှုပ်ရှားမှု ပြင်ဆင်ရန်' : 'Edit Activity');

  return (
    <>
      <SEOHead seo={seoUtils.getPageSEO(mode === 'create' ? 'createActivity' : 'editActivity')} path={mode === 'create' ? '/my-activities/create' : `/my-activities/edit/${slug || ''}`} />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                {pageTitle}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('myActivities.formSubtitle') || (language === 'mm'
                  ? 'ခေါင်းစဉ်၊ ဖော်ပြချက်နှင့် ဓာတ်ပုံများ ထည့်ပါ'
                  : 'Add a title, description, and photos')}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/my-activities/list')} className="hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('createWantedList.back')}
            </Button>
          </div>

          {mode === 'edit' && isLoading ? (
            <Card className="shadow-lg">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-10 w-40" />
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    {t('createWantedList.basicInformation')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField name="title" label={t('createWantedList.titleLabel')} error={errors.title} required>
                    <Input
                      {...form.register('title')}
                      placeholder={t('myActivities.titlePlaceholder') || (language === 'mm' ? 'ဥပမာ၊ ရုံးဖွင့်ပွဲ' : 'e.g. Office opening event')}
                    />
                  </FormField>

                  <FormField name="description" label={t('createWantedList.descriptionLabel')} error={errors.description} required>
                    <Textarea
                      {...form.register('description')}
                      rows={6}
                      placeholder={t('myActivities.descriptionPlaceholder') || (language === 'mm' ? 'လုပ်ငန်းလှုပ်ရှားမှုကို အသေးစိတ် ရေးပါ...' : 'Describe this activity...')}
                    />
                  </FormField>

                  <FormField name="status" label={t('myActivities.status') || (language === 'mm' ? 'အခြေအနေ' : 'Status')} error={errors.status} required>
                    <Select
                      value={form.watch('status') || 'draft'}
                      onValueChange={(value) => form.setValue('status', value as ActivityStatus, { shouldValidate: true })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">{t('myActivities.draft') || 'Draft'}</SelectItem>
                        <SelectItem value="published">{t('myActivities.published') || 'Published'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormField>

                  {uploadPointCost > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {language === 'mm'
                        ? `ထုတ်ဝေပါက ${uploadPointCost} ပွိုင့် ကုန်ကျပါမည်။`
                        : `Publishing costs ${uploadPointCost} points.`}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    {t('myActivities.photos') || (language === 'mm' ? 'ဓာတ်ပုံများ' : 'Photos')}
                    <span className="text-red-500">*</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <MediaUpload
                    maxFiles={MAX_IMAGES}
                    acceptedTypes={['image/*']}
                    initialFiles={initialMediaFiles}
                    onUploadComplete={setMediaIds}
                    onUploadError={(message) => showError(message, t('createWantedList.errorTitle'))}
                    onLoadingChange={setIsMediaLoading}
                  />
                  {errors.media_ids?.message && (
                    <p className="text-sm text-red-500">{errors.media_ids.message}</p>
                  )}
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                {mode === 'edit' ? (
                  <Button type="button" variant="destructive" onClick={handleDelete} disabled={isSubmitting || deleteMutation.isPending}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('myWantedList.delete')}
                  </Button>
                ) : (
                  <span />
                )}
                <div className="flex gap-3 sm:justify-end">
                  <Button type="button" variant="outline" onClick={() => navigate('/my-activities/list')}>
                    {t('createWantedList.cancel')}
                  </Button>
                  <Button type="submit" className="gradient-primary" disabled={isSubmitting || isMediaLoading}>
                    {isSubmitting
                      ? (t('myActivities.saving') || (language === 'mm' ? 'သိမ်းနေသည်...' : 'Saving...'))
                      : mode === 'create'
                        ? (t('myActivities.create') || (language === 'mm' ? 'ဖန်တီးရန်' : 'Create Activity'))
                        : (t('myActivities.save') || (language === 'mm' ? 'သိမ်းရန်' : 'Save Changes'))}
                  </Button>
                </div>
              </div>
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
        isLoading={isConfirmLoading || isSubmitting || deleteMutation.isPending}
      />
    </>
  );
}
