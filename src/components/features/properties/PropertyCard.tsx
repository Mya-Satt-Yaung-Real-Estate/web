import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { PremiumBadge } from './PremiumBadge';
import { TanTanTanBadge } from './TanTanTanBadge';
import { InstallmentBadge } from './InstallmentBadge';
import { MapPin, Bed, Bath, Square, ThumbsUp, MessageCircle, Heart, Eye, DollarSign } from 'lucide-react';
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

  const getListingType = () => {
    return language === 'mm' ? property.listing_type.name_mm : property.listing_type.name_en;
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return `${numPrice.toLocaleString()} MMK`;
  };

  const imageUrl = property.primary_image?.url || property.primary_image?.thumbnail_url || '';

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-border/50 backdrop-blur-sm h-full flex flex-col">
      <div className="relative overflow-hidden aspect-[4/3]">
        <ImageWithFallback
          src={imageUrl}
          alt={getTitle()}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {property.premium && <PremiumBadge />}
          {property.tan_tan_tan && <TanTanTanBadge />}
          {property.bank_installment_available && <InstallmentBadge />}
          {property.is_featured && (
            <Badge className="bg-gradient-to-r from-primary to-[#4a9b82] text-white border-0 shadow-lg">
              {t('listings.featured') || 'Featured'}
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {getPropertyType()}
          </Badge>
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {getListingType()}
          </Badge>
        </div>

        <div className="absolute bottom-3 left-3">
          <Badge className="bg-background/20 backdrop-blur-md border border-white/20 text-white">
            {property.code}
          </Badge>
        </div>

        <div className="absolute bottom-3 right-3">
          <div className="flex items-center gap-1 text-white px-3 py-1.5 rounded-lg bg-background/20 backdrop-blur-md border border-white/20">
            <Eye className="h-4 w-4" />
            <span>{property.view_count.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-4 pt-6 flex-1 flex flex-col">
        <h4 className="mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {getTitle()}
        </h4>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">{getLocation()}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <DollarSign className="h-4 w-4 flex-shrink-0" />
            <span>{formatPrice(property.price)}</span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms}</span>
            </div>
            {property.area_sqft && (
              <div className="flex items-center gap-1.5">
                <Square className="h-4 w-4" />
                <span>{parseFloat(property.area_sqft).toLocaleString()} sqft</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors">
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{property.like_count.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{property.comment_count.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{property.favorite_count.toLocaleString()}</span>
          </div>
        </div>

        <Button 
          onClick={() => navigate(`/properties/${property.slug}`)}
          variant="outline"
          className="w-full mt-auto group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-[#4a9b82] group-hover:text-white group-hover:border-0 group-hover:shadow-lg transition-all"
        >
          {t('listings.viewDetails') || 'View Details'}
        </Button>
      </CardContent>
    </Card>
  );
}
