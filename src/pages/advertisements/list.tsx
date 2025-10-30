import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Calendar, MapPin, Star, Megaphone, Heart, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { useUserAdvertisements } from '@/hooks/queries/useAdvertisement';
import { useLanguage } from '@/contexts/LanguageContext';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useModal } from '@/contexts/ModalContext';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import type { AdvertisementFilters } from '@/types/advertisement';

export default function MyAdvertisementsList() {
  const seo = seoUtils.getPageSEO('advertisements');
  const { t, language } = useLanguage();
  const [filters, setFilters] = useState<AdvertisementFilters>({
    search: '',
    status: undefined,
    verification_status: undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);

  // API hooks
  const { data: advertisementsData, isLoading, error, refetch } = useUserAdvertisements({
    search: filters.search || undefined,
    status: filters.status,
    verification_status: filters.verification_status,
    page: currentPage,
    per_page: 12
  });
  
  // Modal hooks
  const { showSuccess } = useModal();
  const { isOpen: isConfirmOpen, options: confirmOptions, isLoading: isConfirmLoading, showConfirm, hideConfirm, handleConfirm } = useConfirmModal();

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleFilterChange = (key: keyof AdvertisementFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value === "all" ? undefined : value as any }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = (id: number) => {
    showConfirm({
      title: t('advertisements.confirmDeleteTitle') || 'Confirm Delete',
      message: t('advertisements.confirmDeleteMessage') || 'Are you sure you want to delete this advertisement? This action cannot be undone.',
      confirmText: t('advertisements.delete'),
      cancelText: t('advertisements.cancel') || 'Cancel',
      confirmVariant: 'destructive',
      onConfirm: () => {
        return new Promise((resolve) => {
          // TODO: Implement delete mutation
          console.log('Delete advertisement:', id);
          showSuccess(
            t('advertisements.deleteSuccess') || 'Advertisement deleted successfully!',
            t('advertisements.deleteSuccessTitle') || 'Success!'
          );
          refetch();
          resolve();
        });
      },
    });
  };

  const getStatusColor = (status: string, isExpired: boolean) => {
    if (isExpired) return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    if (status === 'draft') return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    if (status === 'pending') return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    if (status === 'approved') return 'bg-green-500/10 text-green-600 border-green-500/20';
    if (status === 'rejected') return 'bg-red-500/10 text-red-600 border-red-500/20';
    if (status === 'expired') return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
  };

  const getVerificationStatusColor = (verificationStatus: string) => {
    if (verificationStatus === 'approved') return 'bg-green-500/10 text-green-600 border-green-500/20';
    if (verificationStatus === 'pending') return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    if (verificationStatus === 'rejected') return 'bg-red-500/10 text-red-600 border-red-500/20';
    return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
  };

  const getStatusLabel = (status: string, isExpired: boolean) => {
    if (isExpired) return t('advertisements.expired');
    if (status === 'draft') return t('advertisements.draft');
    if (status === 'pending') return t('advertisements.pending');
    if (status === 'approved') return t('advertisements.approved');
    if (status === 'rejected') return t('advertisements.rejected');
    if (status === 'expired') return t('advertisements.expired');
    return status;
  };

  const getTitle = (advertisement: any) => {
    return language === 'mm' ? advertisement.title_mm : advertisement.title_en;
  };

  const getLocation = (advertisement: any) => {
    if (!advertisement.location) return t('advertisements.locationNotSpecified');
    const region = language === 'mm' ? advertisement.location.region.name_mm : advertisement.location.region.name_en;
    const township = language === 'mm' ? advertisement.location.township.name_mm : advertisement.location.township.name_en;
    return `${region}, ${township}`;
  };

  return (
    <>
      <SEOHead seo={seo} path="/advertisements" />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                {t('advertisements.title')}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('advertisements.subtitle')}
              </p>
            </div>
            <Button 
              asChild
              className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105"
            >
              <Link to="/advertisements/create">
                <Plus className="h-4 w-4 mr-2" />
                {t('advertisements.createNew')}
              </Link>
            </Button>
          </div>

          {/* Filters */}
          <Card className="glass border-border/50 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('advertisements.searchPlaceholder')}
                      value={filters.search || ''}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                  <Select value={filters.status || "all"} onValueChange={(value) => handleFilterChange('status', value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder={t('advertisements.status')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('advertisements.allStatuses')}</SelectItem>
                      <SelectItem value="draft">{t('advertisements.draft')}</SelectItem>
                      <SelectItem value="pending">{t('advertisements.pending')}</SelectItem>
                      <SelectItem value="approved">{t('advertisements.approved')}</SelectItem>
                      <SelectItem value="rejected">{t('advertisements.rejected')}</SelectItem>
                      <SelectItem value="expired">{t('advertisements.expired')}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.verification_status || "all"} onValueChange={(value) => handleFilterChange('verification_status', value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder={t('advertisements.verificationStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('advertisements.allStatuses')}</SelectItem>
                      <SelectItem value="pending">{t('advertisements.pending')}</SelectItem>
                      <SelectItem value="approved">{t('advertisements.approved')}</SelectItem>
                      <SelectItem value="rejected">{t('advertisements.rejected')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="glass border-border/50">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="glass border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('advertisements.error')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('advertisements.errorDesc') || 'Something went wrong while loading your advertisements.'}
                </p>
                <Button onClick={() => refetch()} variant="outline">
                  {t('advertisements.retry')}
                </Button>
              </CardContent>
            </Card>
          ) : !advertisementsData?.data || advertisementsData.data.length === 0 ? (
            <Card className="glass border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('advertisements.noAdvertisements')}</h3>
                <p className="text-muted-foreground mb-4">
                  {filters.search || filters.status || filters.verification_status
                    ? t('advertisements.noAdvertisementsMatchFilters') || 'No advertisements match your filters'
                    : t('advertisements.noAdvertisementsDesc')}
                </p>
                <Button 
                  asChild
                  className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50"
                >
                  <Link to="/advertisements/create">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('advertisements.createNew')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Advertisements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {advertisementsData.data.map((advertisement) => (
                  <Card key={advertisement.id} className="group hover:shadow-xl transition-all border-border/50 backdrop-blur-sm h-full flex flex-col overflow-hidden">
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden">
                      {advertisement.media?.primary_image ? (
                        <ImageWithFallback
                          src={advertisement.media.primary_image.url}
                          alt={getTitle(advertisement)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <Megaphone className="h-12 w-12 text-primary/50" />
                        </div>
                      )}
                      
                      {/* Overlay Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(advertisement.status, advertisement.is_expired)} backdrop-blur-sm`}
                        >
                          {getStatusLabel(advertisement.status, advertisement.is_expired)}
                        </Badge>
                        {advertisement.is_featured && (
                          <Badge variant="outline" className="bg-yellow-500/90 text-yellow-900 border-yellow-500/50 backdrop-blur-sm">
                            <Star className="h-3 w-3 mr-1" />
                            {t('advertisements.featured')}
                          </Badge>
                        )}
                      </div>

                      {/* Verification Status Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge 
                          variant="outline" 
                          className={`${getVerificationStatusColor(advertisement.verification_status)} backdrop-blur-sm`}
                        >
                          {t(`advertisements.${advertisement.verification_status}`) || advertisement.verification_status}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="space-y-3 pb-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                          {getTitle(advertisement)}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {advertisement.description}
                        </p>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                      {/* Location */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="line-clamp-1">
                            {getLocation(advertisement)}
                          </span>
                        </div>
                      </div>

                      {/* Statistics */}
                      <div className="grid grid-cols-2 gap-4 py-2 border-t border-border/50">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                            <BarChart3 className="h-4 w-4 text-primary" />
                            <span className="font-medium">{advertisement.stats.view_count}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{t('advertisements.views')}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                            <Heart className="h-4 w-4 text-red-500" />
                            <span className="font-medium">{advertisement.stats.favorite_count}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{t('advertisements.favorites')}</p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="pt-4 border-t border-border/50 space-y-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{t('advertisements.created')} {new Date(advertisement.dates.created_at).toLocaleDateString()}</span>
                          </div>
                          {advertisement.is_featured && (
                            <div className="flex items-center gap-1.5 text-yellow-600">
                              <Star className="h-3.5 w-3.5" />
                              <span>{t('advertisements.featured')}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            asChild
                            variant="outline" 
                            size="sm"
                            className="flex-1 bg-primary/10 text-primary hover:bg-primary/20"
                          >
                            <Link to={`/advertisements/detail/${advertisement.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              {t('advertisements.viewDetails')}
                            </Link>
                          </Button>
                          <Button 
                            asChild={advertisement.verification_status !== 'approved'}
                            variant="outline" 
                            size="sm"
                            disabled={advertisement.verification_status === 'approved'}
                            className={`flex-1 bg-primary/10 text-primary hover:bg-primary/20 ${
                              advertisement.verification_status === 'approved' 
                                ? 'opacity-50 cursor-not-allowed' 
                                : ''
                            }`}
                          >
                            <Link 
                              to={advertisement.verification_status === 'approved' ? '#' : `/advertisements/edit/${advertisement.id}`}
                              className={advertisement.verification_status === 'approved' ? 'pointer-events-none' : ''}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              {t('advertisements.edit')}
                            </Link>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(advertisement.id)}
                            className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t('advertisements.delete')}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {advertisementsData.pagination && advertisementsData.pagination.last_page > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={advertisementsData.pagination.last_page}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Confirm Modal */}
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