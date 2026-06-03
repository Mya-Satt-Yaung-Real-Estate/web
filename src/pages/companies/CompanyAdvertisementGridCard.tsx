import { useNavigate } from 'react-router-dom';
import { BarChart3, Calendar, Heart, MapPin, Star } from 'lucide-react';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Advertisement } from '@/types/advertisement';

interface CompanyAdvertisementGridCardProps {
  advertisement: Advertisement;
}

export function CompanyAdvertisementGridCard({ advertisement }: CompanyAdvertisementGridCardProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const getAdvertisementTitle = () => (language === 'mm' ? advertisement.title_mm : advertisement.title_en);
  const getAdvertisementLocation = () => {
    const region = language === 'mm' ? advertisement.location?.region?.name_mm : advertisement.location?.region?.name_en;
    const township = language === 'mm' ? advertisement.location?.township?.name_mm : advertisement.location?.township?.name_en;
    return region && township ? `${township}, ${region}` : '';
  };

  return (
    <Card
      className="group hover:shadow-2xl transition-all border-2 border-border/50 backdrop-blur-sm h-full flex flex-col overflow-hidden cursor-pointer shadow-md hover:border-primary/30"
      onClick={() => navigate(`/advertisements/${advertisement.id}`)}
    >
      <div className={`relative h-48 overflow-hidden ${
        advertisement.media?.primary_image ? '' : 'bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center'
      }`}>
        <ImageWithFallback
          src={advertisement.media?.primary_image?.url || '/jade.png'}
          alt={getAdvertisementTitle()}
          className={`group-hover:scale-105 transition-transform duration-300 ${
            advertisement.media?.primary_image ? 'w-full h-full object-cover' : 'max-w-[80%] max-h-[80%] object-contain'
          }`}
        />

        {advertisement.is_featured && (
          <div className="absolute top-3 left-3">
            <Badge variant="outline" className="bg-yellow-500/90 text-yellow-900 border-yellow-500/50 backdrop-blur-sm text-xs">
              <Star className="h-3 w-3 mr-1" />
              {t('advertisements.featured')}
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="space-y-3 pb-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
            {getAdvertisementTitle()}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {advertisement.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="line-clamp-1">
            {getAdvertisementLocation() || t('advertisements.locationNotSpecified')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 py-2 border-t border-border/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="font-medium">{advertisement.stats?.view_count ?? 0}</span>
            </div>
            <p className="text-xs text-muted-foreground">{t('advertisements.views')}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="font-medium">{advertisement.stats?.favorite_count ?? 0}</span>
            </div>
            <p className="text-xs text-muted-foreground">{t('advertisements.favorites')}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {t('advertisements.created')} {new Date(advertisement.dates?.created_at || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
