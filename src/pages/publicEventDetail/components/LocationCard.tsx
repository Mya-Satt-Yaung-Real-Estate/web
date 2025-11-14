/**
 * Location Card Component
 * 
 * Displays the event's location information.
 */

import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import type { HousingEventDetailRegion, HousingEventDetailTownship } from '@/types/housingEvents';

interface LocationCardProps {
  location: string;
  region: HousingEventDetailRegion;
  township: HousingEventDetailTownship;
  language: 'en' | 'mm';
  t: (key: string) => string | undefined;
}

export function LocationCard({
  location,
  region,
  township,
  language,
  t,
}: LocationCardProps) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6 pt-5 sm:pt-7">
        <h4 className="mb-4">{t('eventDetail.locationAddress') || 'Location & Address'}</h4>
        
        {/* Detailed Address */}
        <div className="space-y-2 p-4 rounded-lg bg-muted/30 border border-border/50">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              {location && (
                <p className="text-sm">{location}</p>
              )}
              {township && (
                <p className="text-sm text-muted-foreground">
                  {language === 'mm' ? township.name_mm : township.name_en}
                </p>
              )}
              {region && (
                <p className="text-sm text-muted-foreground">
                  {language === 'mm' ? region.name_mm : region.name_en}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

