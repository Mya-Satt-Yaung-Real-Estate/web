import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Calendar, MapPin, DollarSign, Home, Bed, Bath, Square, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { useMyShareProfitListings } from '@/hooks/queries/useMyShareProfitListings';
import { useDeleteShareProfitListing } from '@/hooks/mutations';
import { useLanguage } from '@/contexts/LanguageContext';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useModal } from '@/contexts/ModalContext';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import type { ShareProfitListing, ShareProfitWantedType } from '@/types/shareProfitListing';

function getImageUrl(listing: ShareProfitListing): string | undefined {
  const primary = listing.media?.primary_image;
  if (primary) {
    return primary.url || primary.medium_url || primary.small_url || primary.thumbnail_url;
  }
  const first = listing.media?.images?.[0];
  if (first) {
    return first.url || first.medium_url || first.small_url || first.thumbnail_url;
  }
  return undefined;
}

export default function MyShareProfitList() {
  const seo = seoUtils.getPageSEO('myShareProfitList');
  const { t, language } = useLanguage();
  const [filters, setFilters] = useState({
    search: '',
    wanted_type: '' as ShareProfitWantedType | '',
    verification_status: '' as 'pending' | 'approved' | 'rejected' | '',
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { data: response, isLoading, error, refetch } = useMyShareProfitListings({
    search: filters.search || undefined,
    wanted_type: filters.wanted_type || undefined,
    verification_status: filters.verification_status || undefined,
    page: currentPage,
    per_page: 12,
  });

  const listings = response?.data?.data || [];
  const pagination = response?.data?.pagination;
  const deleteMutation = useDeleteShareProfitListing();
  const { showSuccess, showError } = useModal();
  const { isOpen: isConfirmOpen, options: confirmOptions, isLoading: isConfirmLoading, showConfirm, hideConfirm, handleConfirm } = useConfirmModal();

  const hasActiveFilters = Boolean(filters.search || filters.wanted_type || filters.verification_status);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      wanted_type: '',
      verification_status: '',
    });
    setCurrentPage(1);
  };

  const handleDelete = (slug: string, isActive?: boolean) => {
    if (isActive) {
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
              refetch();
              resolve();
            },
            onError: (err: Error) => {
              showError(err.message || (language === 'mm' ? 'ဖျက်မရပါ' : 'Delete failed'), t('editWantedList.errorTitle'));
              reject(err);
            },
          });
        });
      },
    });
  };

  const getStatusColor = (verificationStatus: string, isExpired: boolean) => {
    if (isExpired) return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    if (verificationStatus === 'approved') return 'bg-green-500/10 text-green-600 border-green-500/20';
    if (verificationStatus === 'pending') return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    if (verificationStatus === 'rejected') return 'bg-red-500/10 text-red-600 border-red-500/20';
    return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
  };

  const getStatusLabel = (verificationStatus: string, isExpired: boolean) => {
    if (isExpired) return t('myWantedList.expired');
    if (verificationStatus === 'approved') return t('myWantedList.approved');
    if (verificationStatus === 'pending') return t('myWantedList.pending');
    if (verificationStatus === 'rejected') return t('myWantedList.rejected');
    return verificationStatus;
  };

  const getLocation = (listing: (typeof listings)[number]) => {
    const loc = listing.preferred_location;
    if (!loc) return t('myWantedList.locationNotSpecified');
    const region = language === 'mm' ? loc.region.name_mm : loc.region.name_en;
    const township = language === 'mm' ? loc.township.name_mm : loc.township.name_en;
    return `${township}, ${region}`;
  };

  return (
    <>
      <SEOHead seo={seo} path="/my-share-profit-listings/list" />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                {language === 'mm' ? 'ကျွန်ုပ်၏ အကျိုးတူရ စာရင်းများ' : 'My Share Profit Listings'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {language === 'mm' ? 'အကျိုးတူရ စာရင်းများကို စီမံပါ' : 'Manage your share profit listings'}
              </p>
            </div>
            <Link to="/my-share-profit-listings/create">
              <Button className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                {t('myWantedList.createNewListing')}
              </Button>
            </Link>
          </div>

          <Card className="glass border-border/50 mb-6">
            <CardContent className="p-6 pt-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/** Nested relative so icon centers on the input, not a stretched flex column */}
                <div className="flex-1 w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      placeholder={t('myWantedList.searchPlaceholder')}
                      value={filters.search}
                      onChange={(e) => {
                        setFilters((prev) => ({ ...prev, search: e.target.value }));
                        setCurrentPage(1);
                      }}
                      className="pl-10 h-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 w-full lg:w-auto flex-wrap">
                  <Select
                    value={filters.wanted_type || 'all'}
                    onValueChange={(value) => {
                      setFilters((prev) => ({ ...prev, wanted_type: value === 'all' ? '' : value as ShareProfitWantedType }));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-36 h-10">
                      <SelectValue placeholder={t('myWantedList.type')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('myWantedList.allTypes')}</SelectItem>
                      <SelectItem value="buyer">{t('myWantedList.buyer')}</SelectItem>
                      <SelectItem value="renter">{t('myWantedList.renter')}</SelectItem>
                      <SelectItem value="seller">{t('search.seller') || 'Seller'}</SelectItem>
                      <SelectItem value="share_profit">{t('search.shareProfit')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.verification_status || 'all'}
                    onValueChange={(value) => {
                      setFilters((prev) => ({
                        ...prev,
                        verification_status: value === 'all' ? '' : value as 'pending' | 'approved' | 'rejected',
                      }));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-36 h-10">
                      <SelectValue placeholder={t('myWantedList.verificationStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('myWantedList.allStatus')}</SelectItem>
                      <SelectItem value="pending">{t('myWantedList.pending')}</SelectItem>
                      <SelectItem value="approved">{t('myWantedList.approved')}</SelectItem>
                      <SelectItem value="rejected">{t('myWantedList.rejected')}</SelectItem>
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
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="glass border-border/50 overflow-hidden">
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
                <Home className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('myWantedList.errorLoading')}</h3>
                <Button onClick={() => refetch()} variant="outline">{t('myWantedList.tryAgain')}</Button>
              </CardContent>
            </Card>
          ) : listings.length === 0 ? (
            <Card className="glass border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Home className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('myWantedList.noListingsFound')}</h3>
                <Link to="/my-share-profit-listings/create">
                  <Button className="gradient-primary mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('myWantedList.createFirstListing')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {listings.map((listing) => {
                  const imageUrl = getImageUrl(listing);

                  return (
                  <Card key={listing.id} className="group hover:shadow-xl transition-all border-border/50 h-full flex flex-col overflow-hidden">
                    {imageUrl && (
                      <Link to={`/my-share-profit-listings/detail/${listing.slug}`} className="relative aspect-[16/10] overflow-hidden bg-muted block">
                        <ImageWithFallback
                          src={imageUrl}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                    )}
                    <CardHeader className="space-y-3 pb-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="mb-2 group-hover:text-primary transition-colors line-clamp-2">{listing.title}</h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-primary/5 border-primary/20">
                              <Home className="h-3 w-3 mr-1" />
                              {language === 'mm' ? listing.property_type.name_mm : listing.property_type.name_en}
                            </Badge>
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                              {listing.wanted_type_label}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={getStatusColor(listing.status.verification_status, listing.status.is_expired)}
                            >
                              {getStatusLabel(listing.status.verification_status, listing.status.is_expired)}
                            </Badge>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/my-share-profit-listings/detail/${listing.slug}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                {t('myWantedList.view')}
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/my-share-profit-listings/edit/${listing.slug}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                {t('myWantedList.edit')}
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(listing.slug, listing.status.is_active)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t('myWantedList.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="line-clamp-1">{getLocation(listing)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{listing.budget.budget_range || t('myWantedList.budgetNotSpecified')}</span>
                        </div>
                        <div className="flex flex-wrap gap-3 pt-2">
                          {listing.specifications.bedrooms != null && (
                            <div className="flex items-center gap-1.5 text-sm">
                              <Bed className="h-4 w-4 text-primary" />
                              <span className="text-muted-foreground">{listing.specifications.bedrooms} {t('myWantedList.beds')}</span>
                            </div>
                          )}
                          {listing.specifications.bathrooms != null && (
                            <div className="flex items-center gap-1.5 text-sm">
                              <Bath className="h-4 w-4 text-primary" />
                              <span className="text-muted-foreground">{listing.specifications.bathrooms} {t('myWantedList.baths')}</span>
                            </div>
                          )}
                          {listing.specifications.area_range && (
                            <div className="flex items-center gap-1.5 text-sm">
                              <Square className="h-4 w-4 text-primary" />
                              <span className="text-muted-foreground">{listing.specifications.area_range}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border/50 space-y-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{t('myWantedList.posted')} {listing.created_at}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button asChild variant="outline" size="sm" className="flex-1 bg-primary/10 text-primary hover:bg-primary/20">
                            <Link to={`/my-share-profit-listings/detail/${listing.slug}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              {t('myWantedList.viewDetails')}
                            </Link>
                          </Button>
                          <Button asChild variant="outline" size="sm" className="flex-1 bg-primary/10 text-primary hover:bg-primary/20">
                            <Link to={`/my-share-profit-listings/edit/${listing.slug}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              {t('myWantedList.edit')}
                            </Link>
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
        isLoading={isConfirmLoading}
      />
    </>
  );
}
