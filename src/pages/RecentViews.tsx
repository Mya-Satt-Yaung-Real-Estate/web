import { useNavigate } from 'react-router-dom';
import { Eye, MapPin, Bed, Bath, Square, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoUtils } from '@/lib/seo';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPriceLakh } from '@/lib/utils';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useRecentViews } from '@/hooks/queries/useProperties';
import type { Property } from '@/types/properties';

export function RecentViews() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const seo = seoUtils.getPageSEO('recentViews');

  const { data, isLoading, error } = useRecentViews();
  const recentViews = data?.data?.data || [];

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getTitle = (property: Property) => {
    return language === 'mm' ? property.title_mm : property.title_en;
  };

  const getPropertyTypeName = (property: Property) => {
    if (!property.property_type) return '';
    return language === 'mm' ? property.property_type.name_mm : property.property_type.name_en;
  };

  const getListingTypeName = (property: Property) => {
    if (!property.listing_type) return '';
    return language === 'mm' ? property.listing_type.name_mm : property.listing_type.name_en;
  };

  const getLocationString = (property: Property) => {
    if (property.location?.location_string) {
      return language === 'mm' ? property.location.location_string_mm : property.location.location_string;
    }
    return property.location?.address || '';
  };

  if (isLoading) {
    return (
      <>
        <SEOHead seo={seo} path="/recent-views" />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="backdrop-blur-sm bg-background/95 shadow-sm border-border/50">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-full mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SEOHead seo={seo} path="/recent-views" />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{t('common.error') || 'Error loading recent views'}</p>
              <Button onClick={() => navigate(-1)}>{t('common.back') || 'Back'}</Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead seo={seo} path="/recent-views" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
                {t('services.recentViews') || 'Recent Views'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('services.recentViewsDesc') || 'Properties you recently viewed'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-primary/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back') || 'Back'}
              </Button>
            </div>
          </div>

          {recentViews.length === 0 ? (
            <Card className="backdrop-blur-sm bg-background/95 shadow-sm border-border/50 p-12 text-center">
              <Eye className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="mb-2 text-lg font-semibold">
                {t('recentViews.noRecentViews') || 'No Recent Views'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t('recentViews.startViewing') || 'Start viewing properties to see them here'}
              </p>
              <Button 
                className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
                onClick={() => navigate('/')}
              >
                {t('recentViews.browseProperties') || 'Browse Properties'}
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentViews.map((property: Property) => (
                <Card 
                  key={property.id} 
                  className="backdrop-blur-sm bg-background/95 shadow-sm border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={property.media?.primary_image?.url || property.media?.primary_image?.medium_url || property.media?.primary_image?.thumbnail_url || property.primary_image?.url || property.primary_image?.medium_url || property.primary_image?.thumbnail_url}
                      alt={getTitle(property)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {property.property_type && (
                        <Badge className="bg-gradient-to-r from-primary to-[#4a9b82] text-white border-0 w-fit">
                          {getPropertyTypeName(property)}
                        </Badge>
                      )}
                      {property.listing_type && (
                        <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 w-fit">
                          {getListingTypeName(property)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-6 pt-6">
                    <h3 className="mb-4 font-semibold group-hover:text-primary transition-colors line-clamp-2">
                      {getTitle(property)}
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm line-clamp-1">
                        {getLocationString(property)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{property.bedrooms ?? 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{property.bathrooms ?? 0}</span>
                      </div>
                      {property.area_sqft && (
                        <div className="flex items-center gap-1">
                          <Square className="h-4 w-4" />
                          <span>{parseFloat(property.area_sqft).toLocaleString()} {t('properties.sqft') || 'sqft'}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent font-semibold">
                        {formatPriceLakh(property.price || '0', property.price_lakh, language, property.currency, property.price_amount) || '-'}
                      </span>
                      <Button 
                        variant="outline" 
                        className="border-primary text-primary hover:bg-primary hover:text-white"
                        onClick={() => navigate(`/properties/${property.slug}`)}
                      >
                        {t('recentViews.viewAgain') || 'View Again'}
                      </Button>
                    </div>
                    {(property.dates?.created_at || property.dates?.published_at) && (
                      <p className="text-muted-foreground text-sm">
                        {t('recentViews.viewed') || 'Viewed on'} {formatDate(property.dates.created_at || property.dates.published_at)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

