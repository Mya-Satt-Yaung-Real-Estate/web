import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Calendar, MapPin, DollarSign, Home, Bed, Bath, Square } from 'lucide-react';
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
import { useWantingLists } from '@/hooks/queries/useWantingList';
import { useDeleteWantingList } from '@/hooks/mutations';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';


export default function MyWantedList() {
  const seo = seoUtils.getPageSEO('myWantedList');
  const { t, language } = useLanguage();
  const [filters, setFilters] = useState({
    search: '',
    wanted_type: '' as 'buyer' | 'renter' | '',
    verification_status: '' as 'pending' | 'approved' | 'rejected' | ''
  });
  const [currentPage, setCurrentPage] = useState(1);

  // API hooks
  const { data: wantingListsData, isLoading, error, refetch } = useWantingLists({
    search: filters.search || undefined,
    wanted_type: filters.wanted_type || undefined,
    verification_status: filters.verification_status || undefined,
    page: currentPage,
    per_page: 12
  });
  
  const deleteWantingListMutation = useDeleteWantingList();

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (slug: string) => {
    if (window.confirm('Are you sure you want to delete this wanted listing?')) {
      try {
        await deleteWantingListMutation.mutateAsync(slug);
        toast.success('Wanted listing deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete wanted listing');
        console.error('Delete error:', error);
      }
    }
  };


  const getVerificationStatusColor = (verificationStatus: string, isExpired: boolean) => {
    if (isExpired) return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    if (verificationStatus === 'approved') return 'bg-green-500/10 text-green-600 border-green-500/20';
    if (verificationStatus === 'pending') return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    if (verificationStatus === 'rejected') return 'bg-red-500/10 text-red-600 border-red-500/20';
    return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
  };

  const getVerificationStatusLabel = (verificationStatus: string, isExpired: boolean) => {
    if (isExpired) return t('myWantedList.expired');
    if (verificationStatus === 'approved') return t('myWantedList.approved');
    if (verificationStatus === 'pending') return t('myWantedList.pending');
    if (verificationStatus === 'rejected') return t('myWantedList.rejected');
    return verificationStatus;
  };

  return (
    <>
      <SEOHead seo={seo} path="/my-wanted-listings/list" />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                {t('myWantedList.title')}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('myWantedList.description')}
              </p>
            </div>
            <Link to="/my-wanted-listings/create">
              <Button className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
{t('myWantedList.createNewListing')}
              </Button>
            </Link>
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
                      placeholder={t('myWantedList.searchPlaceholder')}
                      value={filters.search}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                  <Select value={filters.wanted_type || "all"} onValueChange={(value) => handleFilterChange('wanted_type', value === "all" ? "" : value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder={t('myWantedList.type')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('myWantedList.allTypes')}</SelectItem>
                      <SelectItem value="buyer">{t('myWantedList.buyer')}</SelectItem>
                      <SelectItem value="renter">{t('myWantedList.renter')}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.verification_status || "all"} onValueChange={(value) => handleFilterChange('verification_status', value === "all" ? "" : value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder={t('myWantedList.verificationStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('myWantedList.allStatus')}</SelectItem>
                      <SelectItem value="pending">{t('myWantedList.pending')}</SelectItem>
                      <SelectItem value="approved">{t('myWantedList.approved')}</SelectItem>
                      <SelectItem value="rejected">{t('myWantedList.rejected')}</SelectItem>
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
                <Home className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{t('myWantedList.errorLoading')}</h3>
                    <p className="text-muted-foreground mb-4">
                      {t('myWantedList.errorLoadingDesc')}
                    </p>
                <Button onClick={() => refetch()} variant="outline">
{t('myWantedList.tryAgain')}
                </Button>
              </CardContent>
            </Card>
          ) : !wantingListsData?.data || wantingListsData.data.length === 0 ? (
            <Card className="glass border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Home className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('myWantedList.noListingsFound')}</h3>
                <p className="text-muted-foreground mb-4">
                  {filters.search || filters.wanted_type || filters.verification_status
                    ? t('myWantedList.noListingsMatchFilters')
                    : t('myWantedList.noListingsCreated')}
                </p>
                <Link to="/my-wanted-listings/create">
                  <Button className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50">
                    <Plus className="h-4 w-4 mr-2" />
{t('myWantedList.createFirstListing')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Listings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {wantingListsData.data.map((listing) => (
                  <Card key={listing.id} className="group hover:shadow-xl transition-all border-border/50 backdrop-blur-sm h-full flex flex-col overflow-hidden">
                    <CardHeader className="space-y-3 pb-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {listing.title}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="bg-primary/5 border-primary/20">
                                  <Home className="h-3 w-3 mr-1" />
                                  {listing.property_type?.[`name_${language}`] || t('myWantedList.property')}
                                </Badge>
                            <Badge 
                              variant="outline" 
                              className={listing.wanted_type === 'buyer' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'bg-purple-500/10 text-purple-600 border-purple-500/20'}
                            >
                              {listing.wanted_type === 'buyer' ? t('myWantedList.buyer') : t('myWantedList.renter')}
                            </Badge>
                                <Badge 
                                  variant="outline" 
                                  className={getVerificationStatusColor(listing.status?.verification_status || 'pending', listing.status?.is_expired || false)}
                                >
                                  {getVerificationStatusLabel(listing.status?.verification_status || 'pending', listing.status?.is_expired || false)}
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
                              <Link to={`/my-wanted-listings/detail/${listing.slug}`}>
                                <Eye className="h-4 w-4 mr-2" />
{t('myWantedList.view')}
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              asChild={listing.status?.verification_status !== 'approved'}
                              disabled={listing.status?.verification_status === 'approved'}
                            >
                              <Link 
                                to={listing.status?.verification_status === 'approved' ? '#' : `/my-wanted-listings/edit/${listing.slug}`}
                                className={listing.status?.verification_status === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}
                              >
                                <Edit className="h-4 w-4 mr-2" />
{t('myWantedList.edit')}
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(listing.slug)}
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
                      {/* Details */}
                      <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                              <span className="line-clamp-1">
                                {listing.location ? 
                                  `${listing.location[`region_${language}`]}, ${listing.location[`township_${language}`]}` : 
                                  t('myWantedList.locationNotSpecified')
                                }
                              </span>
                            </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{listing.budget?.budget_range || t('myWantedList.budgetNotSpecified')}</span>
                        </div>

                        {/* Property specs */}
                        <div className="flex flex-wrap gap-3 pt-2">
                          {listing.specifications?.bedrooms && (
                            <div className="flex items-center gap-1.5 text-sm">
                              <Bed className="h-4 w-4 text-primary" />
                                  <span className="text-muted-foreground">{listing.specifications.bedrooms} {t('myWantedList.beds')}</span>
                            </div>
                          )}
                          {listing.specifications?.bathrooms && (
                            <div className="flex items-center gap-1.5 text-sm">
                              <Bath className="h-4 w-4 text-primary" />
                                  <span className="text-muted-foreground">{listing.specifications.bathrooms} {t('myWantedList.baths')}</span>
                            </div>
                          )}
                          {listing.specifications?.area_range && (
                            <div className="flex items-center gap-1.5 text-sm">
                              <Square className="h-4 w-4 text-primary" />
                                  <span className="text-muted-foreground">{listing.specifications.area_range} {t('myWantedList.sqft')}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="pt-4 border-t border-border/50 space-y-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                                <span>{t('myWantedList.posted')} {new Date(listing.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            asChild
                            variant="outline" 
                            size="sm"
                            className="flex-1 bg-primary/10 text-primary hover:bg-primary/20"
                          >
                            <Link to={`/my-wanted-listings/detail/${listing.slug}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              {t('myWantedList.viewDetails')}
                            </Link>
                          </Button>
                          <Button 
                            asChild={listing.status?.verification_status !== 'approved'}
                            variant="outline" 
                            size="sm"
                            disabled={listing.status?.verification_status === 'approved'}
                            className={`flex-1 bg-primary/10 text-primary hover:bg-primary/20 ${
                              listing.status?.verification_status === 'approved' 
                                ? 'opacity-50 cursor-not-allowed' 
                                : ''
                            }`}
                          >
                            <Link 
                              to={listing.status?.verification_status === 'approved' ? '#' : `/my-wanted-listings/edit/${listing.slug}`}
                              className={listing.status?.verification_status === 'approved' ? 'pointer-events-none' : ''}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              {t('myWantedList.edit')}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {wantingListsData.pagination && wantingListsData.pagination.last_page > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={wantingListsData.pagination.last_page}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
