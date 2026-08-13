import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Calendar, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo/SEOHead';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { seoUtils } from '@/lib/seo';
import { useMyActivities } from '@/hooks/queries/useMyActivities';
import { useDeleteActivity } from '@/hooks/mutations/useActivityMutations';
import { useLanguage } from '@/contexts/LanguageContext';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { useModal } from '@/contexts/ModalContext';
import type { Activity, ActivityStatus } from '@/types/activity';

function getImageUrl(activity: Activity): string | undefined {
  const primary = activity.primary_image || activity.media?.primary_image;
  if (primary) {
    return primary.url || primary.medium_url || primary.small_url || primary.thumbnail_url;
  }
  const first = activity.media?.images?.[0];
  if (first) {
    return first.url || first.medium_url || first.small_url || first.thumbnail_url;
  }
  return undefined;
}

function formatPostedDate(value?: string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export default function MyActivitiesList() {
  const seo = seoUtils.getPageSEO('myActivities');
  const { t, language } = useLanguage();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ActivityStatus | ''>('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: response, isLoading, error, refetch } = useMyActivities({
    search: search.trim() || undefined,
    status: status || undefined,
    page: currentPage,
    per_page: 12,
  });

  const activities = response?.data?.data || [];
  const pagination = response?.data?.pagination;
  const deleteMutation = useDeleteActivity();
  const { showSuccess, showError } = useModal();
  const {
    isOpen: isConfirmOpen,
    options: confirmOptions,
    isLoading: isConfirmLoading,
    showConfirm,
    hideConfirm,
    handleConfirm,
  } = useConfirmModal();

  const hasActiveFilters = Boolean(search.trim() || status);

  const handleResetFilters = () => {
    setSearch('');
    setStatus('');
    setCurrentPage(1);
  };

  const handleDelete = (slug: string) => {
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
              refetch();
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

  const getStatusClass = (activityStatus: ActivityStatus) => {
    if (activityStatus === 'published') return 'bg-green-500/10 text-green-600 border-green-500/20';
    return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  };

  const getStatusLabel = (activityStatus: ActivityStatus) => {
    if (activityStatus === 'published') return t('myActivities.published') || 'Published';
    return t('myActivities.draft') || 'Draft';
  };

  return (
    <>
      <SEOHead seo={seo} path="/my-activities/list" />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                {t('myActivities.title') || (language === 'mm' ? 'ကျွန်ုပ်၏ လုပ်ငန်းလှုပ်ရှားမှုများ' : 'My Activities')}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('myActivities.description') || (language === 'mm' ? 'လုပ်ငန်းလှုပ်ရှားမှုများကို စီမံပါ' : 'Manage your activity posts')}
              </p>
            </div>
            <Link to="/my-activities/create">
              <Button className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                {t('myActivities.createNew') || (language === 'mm' ? 'အသစ်ဖန်တီးရန်' : 'Create Activity')}
              </Button>
            </Link>
          </div>

          <Card className="glass border-border/50 mb-6">
            <CardContent className="p-6 pt-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      placeholder={t('myActivities.searchPlaceholder') || (language === 'mm' ? 'လုပ်ငန်းလှုပ်ရှားမှုများ ရှာရန်...' : 'Search your activities...')}
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-10 h-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 w-full lg:w-auto flex-wrap">
                  <Select
                    value={status || 'all'}
                    onValueChange={(value) => {
                      setStatus(value === 'all' ? '' : value as ActivityStatus);
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-40 h-10">
                      <SelectValue placeholder={t('myActivities.status') || 'Status'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('myWantedList.allStatus')}</SelectItem>
                      <SelectItem value="draft">{t('myActivities.draft') || 'Draft'}</SelectItem>
                      <SelectItem value="published">{t('myActivities.published') || 'Published'}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 w-full sm:w-auto"
                    onClick={handleResetFilters}
                    disabled={!hasActiveFilters}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {t('search.reset') || 'Reset'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={`skeleton-${index}`} className="glass border-border/50 overflow-hidden">
                  <Skeleton className="aspect-[16/10] w-full rounded-none" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="glass border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('myWantedList.errorLoading')}</h3>
                <Button onClick={() => refetch()} variant="outline">{t('myWantedList.tryAgain')}</Button>
              </CardContent>
            </Card>
          ) : activities.length === 0 ? (
            <Card className="glass border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {t('myActivities.emptyTitle') || (language === 'mm' ? 'လုပ်ငန်းလှုပ်ရှားမှု မရှိသေးပါ' : 'No activities found')}
                </h3>
                <p className="text-muted-foreground mb-4 text-center">
                  {hasActiveFilters
                    ? (t('myWantedList.noListingsMatchFilters') || 'No listings match your current filters.')
                    : (t('myActivities.emptyMessage') || (language === 'mm' ? 'သင့်မှာ လုပ်ငန်းလှုပ်ရှားမှု မရှိသေးပါ။' : "You haven't created any activities yet."))}
                </p>
                <Link to="/my-activities/create">
                  <Button className="gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('myActivities.createFirst') || (language === 'mm' ? 'ပထမဆုံး လုပ်ငန်းလှုပ်ရှားမှု ဖန်တီးပါ' : 'Create your first activity')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {activities.map((activity) => {
                  const imageUrl = getImageUrl(activity);

                  return (
                    <Card key={activity.id} className="group hover:shadow-xl transition-all border-border/50 h-full flex flex-col overflow-hidden">
                      <Link to={`/my-activities/edit/${activity.slug}`} className="relative aspect-[16/10] overflow-hidden bg-muted block">
                        {imageUrl ? (
                          <ImageWithFallback
                            src={imageUrl}
                            alt={activity.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="h-10 w-10" />
                          </div>
                        )}
                      </Link>
                      <CardHeader className="space-y-3 pb-4">
                        <div className="flex-1">
                          <h3 className="mb-2 group-hover:text-primary transition-colors line-clamp-2">{activity.title}</h3>
                          <Badge variant="outline" className={getStatusClass(activity.status)}>
                            {getStatusLabel(activity.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {activity.description || (language === 'mm' ? 'ဖော်ပြချက် မရှိပါ။' : 'No description provided.')}
                        </p>
                        <div className="pt-4 border-t border-border/50 space-y-3">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{t('myWantedList.posted')} {formatPostedDate(activity.published_at || activity.created_at)}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm" className="flex-1 bg-primary/10 text-primary hover:bg-primary/20">
                              <Link to={`/my-activities/edit/${activity.slug}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                {t('myWantedList.edit')}
                              </Link>
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                              onClick={() => handleDelete(activity.slug)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t('myWantedList.delete')}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {pagination && pagination.last_page > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={pagination.last_page}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
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
        isLoading={isConfirmLoading || deleteMutation.isPending}
      />
    </>
  );
}
