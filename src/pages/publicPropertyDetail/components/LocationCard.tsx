/**
 * Location Card Component
 * 
 * Displays property location with map placeholder and address details.
 */

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import type { PublicPropertyLocation } from '@/types/publicProperties';

interface LocationCardProps {
  location: PublicPropertyLocation;
  locationString: string;
  mapLocation: {
    id: string;
    title: string;
    location: string;
    lat: number;
    lng: number;
    type: string;
  } | null;
  language: string;
  t: (key: string) => string | undefined;
}

export function LocationCard({
  location,
  locationString,
  mapLocation,
  language,
  t,
}: LocationCardProps) {
  const handleGetDirections = () => {
    if (mapLocation) {
      const url = `https://www.google.com/maps?q=${mapLocation.lat},${mapLocation.lng}`;
      window.open(url, '_blank');
    } else if (locationString) {
      // Fallback to address search if no coordinates
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationString)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Card>
      <CardContent className="p-6 pt-7">
        <h4 className="mb-4">{t('propertyDetail.locationAddress') || 'Location & Address'}</h4>
        
        {/* Map View - Show actual map if coordinates available */}
        {mapLocation ? (
          <div className="mb-4 rounded-lg overflow-hidden border border-border/50">
            <div className="w-full" style={{ height: '250px' }}>
              <iframe
                src={`https://www.google.com/maps?q=${mapLocation.lat},${mapLocation.lng}&z=15&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t('propertyDetail.mapLocation') || 'Property Location'}
                className="w-full h-full"
              />
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <div 
              className="w-full bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border/50"
              style={{ height: '250px' }}
            >
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('propertyDetail.mapLocation') || 'Map Location'}</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  {t('propertyDetail.mapNotAvailable') || 'Map not available'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Address */}
        {location && (
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
        )}

        {/* Get Directions Button - Show if we have location data */}
        {(mapLocation || locationString) && (
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={handleGetDirections}
          >
            <MapPin className="mr-2 h-4 w-4" />
            {t('propertyDetail.getDirections') || 'Get Directions'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

