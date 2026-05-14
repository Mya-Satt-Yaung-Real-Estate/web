import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, Home, Bed, Bath, Square, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import type { WantedList } from '@/types/wantedList';

interface WantedListingCardProps {
  wanted: WantedList;
}

export function WantedListingCard({ wanted }: WantedListingCardProps) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const getPropertyType = () => {
    return language === 'mm' ? wanted.property_type.name_mm : wanted.property_type.name_en;
  };

  const getLocation = () => {
    const region = language === 'mm' ? wanted.location.region_mm : wanted.location.region_en;
    const township = language === 'mm' ? wanted.location.township_mm : wanted.location.township_en;
    return `${township}, ${region}`;
  };

  const getStatusLabel = () => {
    if (wanted.status.is_expired) {
      return language === 'mm' ? 'သက်တမ်းကုန်ဆုံး' : 'Expired';
    }
    if (wanted.status.verification_status === 'approved' && wanted.status.is_published) {
      return language === 'mm' ? 'အသက်ဝင်သည်' : 'Active';
    }
    return language === 'mm' ? 'အတည်ပြုထားသည်' : 'Approved';
  };

  const getStatusColor = () => {
    if (wanted.status.is_expired) {
      return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
    if (wanted.status.verification_status === 'approved' && wanted.status.is_published) {
      return 'bg-green-500/10 text-green-600 border-green-500/20';
    }
    return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
  };

  const getWantedTypeColor = () => {
    return wanted.wanted_type === 'buyer' 
      ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' 
      : 'bg-purple-500/10 text-purple-600 border-purple-500/20';
  };

  return (
    <Card className="group hover:shadow-xl transition-all border-border/50 backdrop-blur-sm h-full flex flex-col overflow-hidden">
      <CardHeader className="p-3 sm:p-6 space-y-2 sm:space-y-3 pb-3 sm:pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="mb-1.5 sm:mb-2 text-sm sm:text-base group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
              {wanted.title}
            </h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <Badge variant="outline" className="bg-primary/5 border-primary/20 text-xs">
                <Home className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                {getPropertyType()}
              </Badge>
              <Badge variant="outline" className={getWantedTypeColor()}>
                {wanted.wanted_type_label}
              </Badge>
              <Badge variant="outline" className={getStatusColor()}>
                {getStatusLabel()}
              </Badge>
            </div>
          </div>
        </div>

        <div className="min-h-[2rem] sm:min-h-[2.5rem]">
          {wanted.description ? (
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
              {wanted.description}
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
            <span>{wanted.budget.budget_range}</span>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 pt-1.5 sm:pt-2">
            <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm">
              <Bed className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              <span className="text-muted-foreground">{wanted.specifications.bedrooms} {t('listings.beds') || 'Beds'}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm">
              <Bath className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              <span className="text-muted-foreground">{wanted.specifications.bathrooms} {t('listings.baths') || 'Baths'}</span>
            </div>
            {wanted.specifications.area_range && (
              <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm">
                <Square className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                <span className="text-muted-foreground">{wanted.specifications.area_range}</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-3 sm:pt-4 border-t border-border/50 space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>{wanted.created_at}</span>
            </div>
          </div>

          <Button 
            onClick={() => navigate(`/wanted/${wanted.slug}`)}
            className="w-full text-xs sm:text-sm gradient-primary shadow-lg shadow-primary/25 hover:shadow-primary/40"
            size="sm"
          >
            {t('listings.contact') || 'Contact'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

