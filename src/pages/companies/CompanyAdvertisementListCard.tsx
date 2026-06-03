import { useNavigate } from 'react-router-dom';
import { BarChart3, Calendar, Heart, MapPin, Star } from 'lucide-react';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Advertisement } from '@/types/advertisement';

interface CompanyAdvertisementListCardProps {
  advertisement: Advertisement;
}

export function CompanyAdvertisementListCard({ advertisement }: CompanyAdvertisementListCardProps) {
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
      className="group hover:shadow-xl transition-all border-2 border-border/50 backdrop-blur-sm overflow-hidden cursor-pointer shadow-md hover:border-primary/30"
      onClick={() => navigate(`/advertisements/${advertisement.id}`)}
    >
      <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
        <div className="flex flex-col w-full sm:w-64 flex-shrink-0 gap-2">
          <div className={`relative w-full h-48 sm:h-40 overflow-hidden rounded-lg ${
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
              <div className="absolute top-2 left-2">
                <Badge variant="outline" className="bg-yellow-500/90 text-yellow-900 border-yellow-500/50 backdrop-blur-sm text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  {t('advertisements.featured')}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <h3 className="text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                  {getAdvertisementTitle()}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {advertisement.description}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-3.5 w-3.5 text-primary" />
                  <span>{advertisement.stats?.view_count ?? 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5 text-red-500" />
                  <span>{advertisement.stats?.favorite_count ?? 0}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="line-clamp-1">
                {getAdvertisementLocation() || t('advertisements.locationNotSpecified')}
              </span>
            </div>

            {advertisement.location?.address && (
              <div className="pt-2 border-t border-border/50">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-xs text-muted-foreground block mb-1">{t('properties.address')}:</span>
                    <span className="text-sm">{advertisement.location.address}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {t('advertisements.created')} {new Date(advertisement.dates?.created_at || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
