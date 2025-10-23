import { MapPin } from 'lucide-react';
import { Card } from '../ui/card';

interface MapLocation {
  id: string;
  title: string;
  location: string;
  lat: number;
  lng: number;
  price?: string;
  type?: string;
}

interface MapViewProps {
  locations: MapLocation[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
}

export function MapView({ locations, center = { lat: 16.8661, lng: 96.1951 }, zoom = 12, height = '500px' }: MapViewProps) {
  // Default center is Yangon, Myanmar
  
  return (
    <Card className="overflow-hidden shadow-lg border-border/50">
      <div 
        className="relative bg-gradient-to-br from-primary/5 via-background to-primary/10" 
        style={{ height }}
      >
        {/* Google Maps Embed */}
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${center.lat},${center.lng}&zoom=${zoom}&maptype=roadmap`}
        />
        
        {/* Overlay for location markers info */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background/10" />

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg pointer-events-auto z-10">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-foreground">{locations.length} Featured Locations</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Premium properties in Yangon</p>
        </div>
      </div>
    </Card>
  );
}
