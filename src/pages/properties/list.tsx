import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Calendar, MapPin, Star, Heart, ThumbsUp, MessageSquare, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { propertyApi } from '@/services/api/properties';
import { useQuery } from '@tanstack/react-query';
import { useRegions, useTownships } from '@/hooks/queries/useLocations';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useModal } from '@/contexts/ModalContext';

export default function MyPropertiesList() {
  const seo = seoUtils.getPageSEO('properties');
  const { t, language } = useLanguage();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<string>('all');
  const [regionId, setRegionId] = useState<string>('all');
  const [townshipId, setTownshipId] = useState<string>('all');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['my-properties', currentPage],
    queryFn: () => propertyApi.getMyProperties(currentPage, 12).then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const { data: regionsResp } = useRegions();
  const { data: townshipsResp } = useTownships();
  const regions = regionsResp?.data || [];
  const allTownships = townshipsResp?.data || [];
  const filteredTownships = regionId === 'all' ? allTownships : allTownships.filter((t: any) => String(t.region_id) === regionId);

  // Modal hooks
  const { showSuccess } = useModal();
  const { isOpen: isConfirmOpen, options: confirmOptions, isLoading: isConfirmLoading, showConfirm, hideConfirm, handleConfirm } = useConfirmModal();

  const handleDelete = (id: number) => {
    showConfirm({
      title: t('properties.confirmDeleteTitle') || 'Confirm Delete',
      message: t('properties.confirmDeleteMessage') || 'Are you sure you want to delete this property? This action cannot be undone.',
      confirmText: t('properties.delete'),
      cancelText: t('advertisements.cancel') || 'Cancel',
      confirmVariant: 'destructive',
      onConfirm: async () => {
        await propertyApi.deleteProperty(String(id));
        showSuccess(
          t('properties.deleteSuccess') || 'Property deleted successfully!',
          t('properties.deleteSuccessTitle') || 'Success!'
        );
        await refetch();
      },
    });
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const getTitle = (property: any) => (language === 'mm' ? property.title_mm : property.title_en);
  const getLocation = (property: any) => {
    const region = language === 'mm' ? property.location?.region?.name_mm : property.location?.region?.name_en;
    const township = language === 'mm' ? property.location?.township?.name_mm : property.location?.township?.name_en;
    return region && township ? `${region}, ${township}` : t('advertisements.locationNotSpecified');
  };
  const getPropertyType = (property: any) => (language === 'mm' ? property.property_type?.name_mm : property.property_type?.name_en) || '';
  const getListingType = (property: any) => (language === 'mm' ? property.listing_type?.name_mm : property.listing_type?.name_en) || '';

  const getVerificationStatusColor = (verificationStatus: string) => {
    if (verificationStatus === 'approved') return 'bg-green-500/10 text-green-600 border-green-500/20';
    if (verificationStatus === 'pending') return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    if (verificationStatus === 'rejected') return 'bg-red-500/10 text-red-600 border-red-500/20';
    return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
  };

  return (
    <>
      <SEOHead seo={seo} path="/properties" />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                {t('properties.title')}
              </h1>
              <p className="text-muted-foreground mt-2">{t('properties.subtitle')}</p>
            </div>
            <Button asChild className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105">
              <Link to="/create-listing">
                <Plus className="h-4 w-4 mr-2" />
                {t('properties.createNew')}
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
                      placeholder={t('forms.searchPlaceholder')}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full lg:w-auto">
                  {/* Status */}
                  <Select value={status} onValueChange={(v) => setStatus(v)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder={t('properties.status')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('properties.allStatuses')}</SelectItem>
                      <SelectItem value="draft">{t('advertisements.draft')}</SelectItem>
                      <SelectItem value="published">{t('createAdvertisement.published')}</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Region */}
                  <Select value={regionId} onValueChange={(v) => { setRegionId(v); setTownshipId('all'); }}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder={t('createAdvertisement.region')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('properties.allRegions')}</SelectItem>
                      {regions.map((r: any) => (
                        <SelectItem key={r.id} value={String(r.id)}>{language === 'mm' ? r.name_mm : r.name_en}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Township */}
                  <Select value={townshipId} onValueChange={(v) => setTownshipId(v)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder={t('createAdvertisement.township')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('properties.allTownships')}</SelectItem>
                      {filteredTownships.map((ts: any) => (
                        <SelectItem key={ts.id} value={String(ts.id)}>{language === 'mm' ? ts.name_mm : ts.name_en}</SelectItem>
                      ))}
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
                <h3 className="text-lg font-semibold mb-2">{t('common.error')}</h3>
                <p className="text-muted-foreground mb-4">{t('properties.errorDesc')}</p>
                <Button onClick={() => refetch()} variant="outline">
                  {t('advertisements.retry')}
                </Button>
              </CardContent>
            </Card>
          ) : !data?.data || data.data.length === 0 ? (
            <Card className="glass border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <h3 className="text-lg font-semibold mb-2">{t('properties.noProperties')}</h3>
                <p className="text-muted-foreground mb-4">{t('properties.noPropertiesDesc')}</p>
                <Button asChild className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50">
                  <Link to="/create-listing">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('properties.createNew')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {data.data
                  .filter((p: any) => {
                    if (!search) return true;
                    const title = getTitle(p) || '';
                    return title.toLowerCase().includes(search.toLowerCase());
                  })
                  .filter((p: any) => (status === 'all' ? true : (p.status || '').toLowerCase() === status))
                  .filter((p: any) => (regionId === 'all' ? true : String(p.location?.region?.id) === regionId))
                  .filter((p: any) => (townshipId === 'all' ? true : String(p.location?.township?.id) === townshipId))
                  .map((property: any) => (
                    <Card key={property.id} className="group hover:shadow-xl transition-all border-border/50 backdrop-blur-sm h-full flex flex-col overflow-hidden">
                      {/* Image Section */}
                      <div className="relative h-48 overflow-hidden">
                        {property.primary_image ? (
                          <ImageWithFallback
                            src={property.primary_image.url}
                            alt={getTitle(property)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center" />
                        )}

                        {/* Overlay Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {property.is_featured && (
                            <Badge variant="outline" className="bg-yellow-500/90 text-yellow-900 border-yellow-500/50 backdrop-blur-sm">
                              <Star className="h-3 w-3 mr-1" />
                              {t('premium.badge')}
                            </Badge>
                          )}
                          {property.tan_tan_tan && (
                            <Badge variant="outline" className="bg-primary/90 text-white border-primary/50 backdrop-blur-sm">
                              {t('categories.tantantan')}
                            </Badge>
                          )}
                        </div>

                        {/* Verification Status Badge */}
                        <div className="absolute top-3 right-3">
                          <Badge variant="outline" className={`${getVerificationStatusColor(property.verification_status)} backdrop-blur-sm`}>
                            {t(`advertisements.${property.verification_status}`) || property.verification_status}
                          </Badge>
                        </div>

                        {/* Bottom Types Row */}
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/40 to-transparent">
                          <div className="flex items-center justify-between gap-2">
                            <Badge variant="outline" className="bg-background/80 text-foreground border-border/50 truncate max-w-[55%]">
                              {getPropertyType(property)}
                            </Badge>
                            <Badge variant="outline" className="bg-background/80 text-foreground border-border/50 truncate max-w-[40%]">
                              {getListingType(property)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <CardHeader className="space-y-3 pb-4">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                            {getTitle(property)}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{property.description}</p>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                        {/* Location */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="line-clamp-1">{getLocation(property)}</span>
                          </div>
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-4 gap-2 py-2 border-t border-border/50">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                              <Eye className="h-4 w-4 text-primary" />
                              <span className="font-medium">{property.stats?.view_count ?? 0}</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                              <Heart className="h-4 w-4 text-red-500" />
                              <span className="font-medium">{property.stats?.favorite_count ?? 0}</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                              <ThumbsUp className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">{property.stats?.like_count ?? 0}</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                              <MessageSquare className="h-4 w-4 text-emerald-500" />
                              <span className="font-medium">{property.stats?.comment_count ?? 0}</span>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="pt-4 border-t border-border/50 space-y-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>
                                {t('advertisements.created')} {new Date(property.dates?.published_at || Date.now()).toLocaleDateString()}
                              </span>
                            </div>
                            {property.is_featured && (
                              <div className="flex items-center gap-1.5 text-yellow-600">
                                <Star className="h-3.5 w-3.5" />
                                <span>{t('advertisements.featured')}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm" className="flex-1 bg-primary/10 text-primary hover:bg-primary/20">
                              <Link to={`/properties/detail/${property.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                {t('properties.viewDetails')}
                              </Link>
                            </Button>
                            {property.verification_status === 'pending' && (
                              <Button 
                                asChild
                                variant="outline" 
                                size="sm"
                                className="flex-1 bg-primary/10 text-primary hover:bg-primary/20"
                              >
                                <Link to={`/post-property?tab=property&editId=${property.id}`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  {t('properties.edit')}
                                </Link>
                              </Button>
                            )}
                            {property.verification_status === 'pending' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDelete(property.id)}
                                className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t('properties.delete')}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>

              {data.pagination && data.pagination.last_page > 1 && (
                <div className="flex justify-center">
                  <Pagination currentPage={currentPage} totalPages={data.pagination.last_page} onPageChange={handlePageChange} />
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


