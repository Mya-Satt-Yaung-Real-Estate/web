import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Eye, ThumbsUp, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import type { PublicAdvertisement } from '@/types/publicAdvertisements';

interface AdvertisementCardProps {
  advertisement: PublicAdvertisement;
}

export function AdvertisementCard({ advertisement }: AdvertisementCardProps) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const title = language === 'mm' ? advertisement.title_mm : advertisement.title_en;

  const getLocation = () => {
    if (!advertisement.location) return '';
    const region = language === 'mm' 
      ? advertisement.location.region.name_mm 
      : advertisement.location.region.name_en;
    const township = language === 'mm' 
      ? advertisement.location.township.name_mm 
      : advertisement.location.township.name_en;
    return `${township}, ${region}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'mm' ? 'my-MM' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="group hover:shadow-xl transition-all border-border/50 backdrop-blur-sm h-full flex flex-col overflow-hidden">
      {/* Image */}
      {advertisement.primary_image && (
        <div className="relative aspect-video overflow-hidden bg-muted">
          <ImageWithFallback
            src={advertisement.primary_image.url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {advertisement.days_until_expiry > 0 && advertisement.expires_in_text && (
            <div className="absolute top-2 right-2 z-10">
              <Badge variant="outline" className="bg-background/90 backdrop-blur-sm text-foreground border-border">
                {advertisement.expires_in_text}
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
              {title}
            </h3>
            {advertisement.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="line-clamp-1">{getLocation()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="min-h-[2.5rem]">
          {advertisement.description ? (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {advertisement.description}
            </p>
          ) : (
            <div className="text-sm text-muted-foreground line-clamp-2 opacity-0">
              &nbsp;
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                <span>{advertisement.stats.view_count.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ThumbsUp className={`h-3.5 w-3.5 ${advertisement.is_favorite ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                <span>{advertisement.stats.favorite_count.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(advertisement.published_at)}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border/50">
          <Button 
            onClick={() => {
              // Navigate to advertisement detail using ID
              navigate(`/advertisements/${advertisement.id}`);
            }}
            className="w-full gradient-primary shadow-lg shadow-primary/25 hover:shadow-primary/40"
            size="sm"
          >
            {t('publicAdvertisements.viewDetails') || 'View Details'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

