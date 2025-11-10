import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { PremiumBadge } from './PremiumBadge';
import { TanTanTanBadge } from './TanTanTanBadge';
import { MapPin, Bed, Bath, Square, Eye, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import type { PublicProperty } from '@/types/publicProperties';

interface PropertyCardProps {
  property: PublicProperty;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const getTitle = () => {
    return language === 'mm' ? property.title_mm : property.title_en;
  };

  const getLocation = () => {
    const region = language === 'mm' ? property.region.name_mm : property.region.name_en;
    const township = language === 'mm' ? property.township.name_mm : property.township.name_en;
    return `${township}, ${region}`;
  };

  const getPropertyType = () => {
    return language === 'mm' ? property.property_type.name_mm : property.property_type.name_en;
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    if (numPrice >= 1000000) {
      return `${(numPrice / 1000000).toFixed(1)}M MMK`;
    }
    if (numPrice >= 1000) {
      return `${(numPrice / 1000).toFixed(1)}K MMK`;
    }
    return `${numPrice.toLocaleString()} MMK`;
  };

  const imageUrl = property.primary_image?.url || property.primary_image?.thumbnail_url || '';

  return (
    <Card className="group hover:shadow-xl transition-all border-border/50 hover:border-primary/50 overflow-hidden h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={getTitle()}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {property.premium && <PremiumBadge />}
          {property.tan_tan_tan && <TanTanTanBadge />}
          {property.is_featured && (
            <Badge className="bg-gradient-to-r from-primary to-[#4a9b82] text-white border-0 shadow-lg">
              <Star className="h-3 w-3 mr-1 fill-white" />
              {t('listings.featured') || 'Featured'}
            </Badge>
          )}
        </div>

        <Badge variant="secondary" className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm">
          {getPropertyType()}
        </Badge>

        <div className="absolute bottom-3 left-3">
          <span className="text-white px-3 py-1.5 rounded-lg bg-background/20 backdrop-blur-md border border-white/20 font-semibold">
            {formatPrice(property.price)}
          </span>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
          {getTitle()}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="line-clamp-1">{getLocation()}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1.5">
                <Bed className="h-4 w-4" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1.5">
                <Bath className="h-4 w-4" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.area_sqft && (
              <div className="flex items-center gap-1.5">
                <Square className="h-4 w-4" />
                <span>{parseFloat(property.area_sqft).toLocaleString()} sqft</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{property.view_count.toLocaleString()} {t('listings.views') || 'views'}</span>
          </div>
        </div>

        <Button 
          onClick={() => navigate(`/property/${property.slug}`)}
          className="w-full mt-auto gradient-primary group-hover:shadow-lg transition-all"
        >
          {t('listings.viewDetails') || 'View Details'}
        </Button>
      </CardContent>
    </Card>
  );
}

