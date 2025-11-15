/**
 * Map View Component
 * 
 * Displays property locations on a map.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ExternalLink } from 'lucide-react';

interface Location {
  id: string;
  title: string;
  location: string;
  lat: number;
  lng: number;
  type: string;
}

interface MapViewProps {
  locations: Location[];
  height?: string;
}

export function MapView({ locations, height = "400px" }: MapViewProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Property Locations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="w-full bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border/50"
          style={{ height }}
        >
          <div className="text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
            <p className="text-muted-foreground mb-4">
              {locations.length} properties found in the area
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {locations.slice(0, 5).map((location) => (
                <Badge key={location.id} variant="outline" className="text-xs">
                  {location.title}
                </Badge>
              ))}
              {locations.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{locations.length - 5} more
                </Badge>
              )}
            </div>
            <div className="mt-4">
              <button className="inline-flex items-center gap-2 text-primary hover:underline">
                <ExternalLink className="h-4 w-4" />
                Open in Maps
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
