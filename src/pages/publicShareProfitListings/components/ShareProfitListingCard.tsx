import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, Home, Bed, Bath, Square, Calendar } from 'lucide-react';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import type { ShareProfitListing } from '@/types/shareProfitListing';

interface ShareProfitListingCardProps {
  listing: ShareProfitListing;
}

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

function getWantedTypeColor(wantedType: string): string {
  switch (wantedType) {
    case 'buyer':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    case 'renter':
      return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
    case 'seller':
      return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
    case 'share_profit':
      return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    default:
      return 'bg-primary/5 text-primary border-primary/20';
  }
}

export function ShareProfitListingCard({ listing }: ShareProfitListingCardProps) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const imageUrl = getImageUrl(listing);

  const getPropertyType = () => {
    return language === 'mm' ? listing.property_type.name_mm : listing.property_type.name_en;
  };

  const getLocation = () => {
    const region = language === 'mm'
      ? listing.preferred_location.region.name_mm
      : listing.preferred_location.region.name_en;
    const township = language === 'mm'
      ? listing.preferred_location.township.name_mm
      : listing.preferred_location.township.name_en;
    return `${township}, ${region}`;
  };

  const getStatusLabel = () => {
    if (listing.status.is_expired) {
      return language === 'mm' ? 'သက်တမ်းကုန်ဆုံး' : 'Expired';
    }
    if (listing.status.verification_status === 'approved' && listing.status.is_published) {
      return language === 'mm' ? 'အသက်ဝင်သည်' : 'Active';
    }
    return language === 'mm' ? 'အတည်ပြုထားသည်' : 'Approved';
  };

  const getStatusColor = () => {
    if (listing.status.is_expired) {
      return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
    if (listing.status.verification_status === 'approved' && listing.status.is_published) {
      return 'bg-green-500/10 text-green-600 border-green-500/20';
    }
    return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
  };

  return (
    <Card className="group hover:shadow-xl transition-all border-border/50 backdrop-blur-sm h-full flex flex-col overflow-hidden">
      {imageUrl && (
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <ImageWithFallback
            src={imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <CardHeader className="p-3 sm:p-6 space-y-2 sm:space-y-3 pb-3 sm:pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="mb-1.5 sm:mb-2 text-sm sm:text-base group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
              {listing.title}
            </h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <Badge variant="outline" className="bg-primary/5 border-primary/20 text-xs">
                <Home className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                {getPropertyType()}
              </Badge>
              <Badge variant="outline" className={getWantedTypeColor(listing.wanted_type)}>
                {listing.wanted_type_label}
              </Badge>
              <Badge variant="outline" className={getStatusColor()}>
                {getStatusLabel()}
              </Badge>
            </div>
          </div>
        </div>

        <div className="min-h-[2rem] sm:min-h-[2.5rem]">
          {listing.description ? (
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
              {listing.description}
            </p>
          ) : (
            <div className="text-xs sm:text-sm text-muted-foreground line-clamp-2 opacity-0">
              &nbsp;
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-6 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
            <span className="line-clamp-1">{getLocation()}</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
            <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
            <span>{listing.budget.budget_range}</span>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 pt-1.5 sm:pt-2">
            <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm">
              <Bed className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              <span className="text-muted-foreground">{listing.specifications.bedrooms} {t('listings.beds') || 'Beds'}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm">
              <Bath className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              <span className="text-muted-foreground">{listing.specifications.bathrooms} {t('listings.baths') || 'Baths'}</span>
            </div>
            {listing.specifications.area_range && (
              <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm">
                <Square className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                <span className="text-muted-foreground">{listing.specifications.area_range}</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-3 sm:pt-4 border-t border-border/50 space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>{listing.created_at}</span>
            </div>
            {listing.status.expires_at && (
              <span className="text-[10px] sm:text-xs">
                {language === 'mm' ? 'သက်တမ်းကုန်' : 'Expires'}: {listing.status.expires_at}
              </span>
            )}
          </div>

          <Button
            onClick={() => navigate(`/share-profit/${listing.slug}`)}
            className="w-full text-xs sm:text-sm gradient-primary shadow-lg shadow-primary/25 hover:shadow-primary/40"
            size="sm"
          >
            {t('listings.viewDetails') || 'View Details'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
