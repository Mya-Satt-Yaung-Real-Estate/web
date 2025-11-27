import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LazyImage } from '@/components/LazyImage';
import { MapPin, Bed, Bath, Square } from 'lucide-react';
import type { AiToolResult, AiProperty } from '@/types/aiAssistant';

interface MobileAiPropertyResultsProps {
  tool: AiToolResult;
}

export const MobileAiPropertyResults = memo(function MobileAiPropertyResults({ tool }: MobileAiPropertyResultsProps) {
  if (tool.type !== 'property_search' || !tool.result) {
    return null;
  }

  const result = tool.result as { count: number; properties: AiProperty[] };
  const properties = result.properties || [];

  if (properties.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
        <h3 className="text-sm font-bold text-gray-900">
          Found {result.count} {result.count === 1 ? 'property' : 'properties'}
        </h3>
      </div>
      
      <div className="flex flex-col gap-3">
        {properties.map((property, index) => (
          <a
            key={property.id}
            href={`/mobile/properties/${property.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 overflow-hidden group-active:scale-[0.98] group-hover:border-primary/30">
              <div className="flex flex-row">
                <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden bg-gray-100">
                  <LazyImage
                    src={property.image_url || '/placeholder-property.jpg'}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-1.5 right-1.5 flex gap-1">
                    {property.property_type && (
                      <Badge className="text-[10px] bg-black/70 backdrop-blur-sm text-white border-0 shadow-lg font-medium px-1.5 py-0.5">
                        {property.property_type}
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-3 flex-1 flex flex-col justify-between min-w-0">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm mb-1.5 line-clamp-2 text-gray-900 group-hover:text-primary transition-colors leading-snug">
                      {property.title}
                    </h4>
                    
                    {property.price && (
                      <div className="text-base font-bold text-primary mb-2">
                        {property.price} <span className="text-xs font-normal text-gray-500">MMK</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {property.bedrooms && (
                        <Badge variant="secondary" className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5">
                          <Bed className="w-3 h-3 mr-1" />
                          {property.bedrooms}
                        </Badge>
                      )}
                      {property.bathrooms && (
                        <Badge variant="secondary" className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5">
                          <Bath className="w-3 h-3 mr-1" />
                          {property.bathrooms}
                        </Badge>
                      )}
                      {property.area_sqft && (
                        <Badge variant="secondary" className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5">
                          <Square className="w-3 h-3 mr-1" />
                          {property.area_sqft} sqft
                        </Badge>
                      )}
                    </div>

                    {property.address && (
                      <div className="flex items-start text-xs text-gray-600 mb-1.5">
                        <MapPin className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-1">{property.address}</span>
                      </div>
                    )}
                  </div>

                  {property.listing_type && (
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary w-fit font-medium mt-1">
                      {property.listing_type}
                    </Badge>
                  )}
                </CardContent>
              </div>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
});

