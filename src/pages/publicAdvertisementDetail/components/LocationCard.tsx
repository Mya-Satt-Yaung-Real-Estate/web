/**
 * Location Card Component
 * 
 * Displays the advertisement's location information.
 */

import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import type { PublicAdvertisementDetailLocation } from '@/types/publicAdvertisements';

interface LocationCardProps {
  location: PublicAdvertisementDetailLocation;
  language: 'en' | 'mm';
  t: (key: string) => string | undefined;
}

export function LocationCard({
  location,
  language,
  t,
}: LocationCardProps) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6 pt-5 sm:pt-7">
        <h4 className="mb-4">{t('advertisementDetail.locationAddress') || 'Location & Address'}</h4>
        
        {/* Detailed Address */}
        <div className="space-y-2 p-4 rounded-lg bg-muted/30 border border-border/50">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              {location.address && (
                <p className="text-sm">{location.address}</p>
              )}
              {location.township && (
                <p className="text-sm text-muted-foreground">
                  {language === 'mm' ? location.township.name_mm : location.township.name_en}
                </p>
              )}
              {location.region && (
                <p className="text-sm text-muted-foreground">
                  {language === 'mm' ? location.region.name_mm : location.region.name_en}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

