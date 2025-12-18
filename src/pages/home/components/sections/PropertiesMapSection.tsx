/**
 * Properties Map Section Component
 * 
 * Displays properties on an interactive map using Leaflet.
 */

import { useMemo, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Phone, Building2, Tag, Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPriceLakh } from '@/lib/utils';
import { usePropertiesMap } from '@/hooks/queries/home';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { MapProperty } from '@/types/mapProperties';

// Fix for default marker icon in React-Leaflet
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

// Component to fit map bounds to show all markers
function FitBounds({ properties }: { properties: MapProperty[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (properties.length === 0) return;
    
    const bounds = L.latLngBounds(
      properties.map(prop => [
        parseFloat(prop.latitude),
        parseFloat(prop.longitude),
      ] as [number, number])
    );
    
    // Only fit bounds if we have valid coordinates
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, properties]);
  
  return null;
}

// Map Content Component - Reusable for both card and modal
interface MapContentProps {
  properties: MapProperty[];
  defaultCenter: [number, number];
  defaultZoom: number;
  language: string;
  onViewDetails: (slug: string) => void;
  formatPrice: (price: string, priceLakh?: string | number) => string;
}

function MapContent({ 
  properties, 
  defaultCenter, 
  defaultZoom, 
  language, 
  onViewDetails,
  formatPrice 
}: MapContentProps) {
  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {properties.map((property) => {
        const lat = parseFloat(property.latitude);
        const lng = parseFloat(property.longitude);
        
        if (isNaN(lat) || isNaN(lng)) return null;
        
        const title = language === 'mm' ? property.title_mm : property.title_en;
        
        return (
          <Marker
            key={property.id}
            position={[lat, lng]}
          >
            <Popup>
              <div className="p-3 min-w-[250px] max-w-[300px]">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                  {title || `Property #${property.id}`}
                </h3>
                
                {property.code && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{property.code}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-2">
                  {property.property_type && (
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {language === 'mm' ? property.property_type.name_mm : property.property_type.name_en}
                      </span>
                    </div>
                  )}
                  {property.listing_type && (
                    <span className="text-xs text-muted-foreground">
                      • {language === 'mm' ? property.listing_type.name_mm : property.listing_type.name_en}
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-primary mb-2">
                  {formatPrice(property.price, property.price_lakh)}
                </p>

                {property.phone_numbers && property.phone_numbers.length > 0 && (
                  <div className="flex items-start gap-1.5 mb-3">
                    <Phone className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col gap-1">
                      {property.phone_numbers.map((phone, index) => (
                        <a
                          key={index}
                          href={`tel:${phone}`}
                          className="text-xs text-primary hover:underline"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => onViewDetails(property.slug)}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Details
                </Button>
              </div>
            </Popup>
          </Marker>
        );
      })}
      
      <FitBounds properties={properties} />
    </MapContainer>
  );
}

export function PropertiesMapSection() {
  const { language, t } = useLanguage();
  const { data, isLoading, error } = usePropertiesMap();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const properties = useMemo(() => {
    if (!data?.data?.data) return [];
    return data.data.data;
  }, [data]);

  // Default center: Yangon, Myanmar
  const defaultCenter: [number, number] = [16.8661, 96.1951];
  const defaultZoom = 12;

  // Format price for display using utility function
  const formatPrice = (price: string, priceLakh?: string | number): string => {
    return formatPriceLakh(price, priceLakh, language);
  };

  const handleViewDetails = (slug: string) => {
    window.open(`/properties/${slug}`, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <Skeleton className="w-full h-[600px] sm:h-[400px] rounded-lg" />
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (error || properties.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 relative z-40">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="mb-4">
            {t('home.propertiesMapLocation.title') || 'Properties Map Location'}
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            {t('home.propertiesMapLocation.description') || 'Explore properties on the map to find your perfect location'}
          </p>
        </div>

        {/* Map Card - Hide when modal is open to prevent conflicts */}
        {!isModalOpen && (
          <Card className="overflow-hidden relative z-40">
            <CardContent className="p-4 sm:p-6">
              <div className="relative w-full h-[600px] sm:h-[400px] z-40">
                {/* Maximize Button */}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 z-[1000] bg-background/90 backdrop-blur-sm hover:bg-background shadow-lg"
                  onClick={() => setIsModalOpen(true)}
                  aria-label="Maximize map"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>

                <div className="absolute inset-0 z-40">
                  <MapContent
                    properties={properties}
                    defaultCenter={defaultCenter}
                    defaultZoom={defaultZoom}
                    language={language}
                    onViewDetails={handleViewDetails}
                    formatPrice={formatPrice}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Large Map Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent 
            className="max-w-[95vw] max-h-[95vh] w-[90vw] h-[90vh] p-0 sm:rounded-lg [&>button]:hidden"
            style={{ maxWidth: 'none', width: '90vw', height: '90vh' }}
          >
            <div className="relative w-full h-full">
              {/* Close Button */}
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-4 right-4 z-[1000] bg-background/90 backdrop-blur-sm hover:bg-background shadow-lg"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close map"
              >
                <X className="h-4 w-4" />
              </Button>

              <MapContent
                properties={properties}
                defaultCenter={defaultCenter}
                defaultZoom={defaultZoom}
                language={language}
                onViewDetails={handleViewDetails}
                formatPrice={formatPrice}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

