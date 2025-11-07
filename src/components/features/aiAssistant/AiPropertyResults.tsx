import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LazyImage } from '@/components/LazyImage';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square } from 'lucide-react';
import type { AiToolResult, AiProperty } from '@/types/aiAssistant';

interface AiPropertyResultsProps {
  tool: AiToolResult;
}

export const AiPropertyResults = memo(function AiPropertyResults({ tool }: AiPropertyResultsProps) {
  if (tool.type !== 'property_search' || !tool.result) {
    return null;
  }

  const result = tool.result as { count: number; properties: AiProperty[] };
  const properties = result.properties || [];

  if (properties.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
        <h3 className="text-base font-semibold text-gray-900">
          Found {result.count} {result.count === 1 ? 'property' : 'properties'}
        </h3>
      </div>
      
      <div className="flex flex-col gap-3">
        {properties.map((property, index) => (
          <Link
            key={property.id}
            to={`/properties/${property.id}`}
            className="block group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group-hover:border-primary/20">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 h-48 sm:h-auto sm:flex-shrink-0 overflow-hidden bg-gray-100">
                  <LazyImage
                    src={property.image_url || '/placeholder-property.jpg'}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    {property.property_type && (
                      <Badge className="text-xs bg-white/90 backdrop-blur-sm text-gray-700 border-0 shadow-sm">
                        {property.property_type}
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 line-clamp-2 text-gray-900 group-hover:text-primary transition-colors">
                      {property.title}
                    </h4>
                    
                    {property.price && (
                      <div className="text-lg font-bold text-primary mb-2">
                        {property.price} <span className="text-xs font-normal text-gray-500">MMK</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-2">
                      {property.bedrooms && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          <Bed className="w-3 h-3 mr-1" />
                          {property.bedrooms}
                        </Badge>
                      )}
                      {property.bathrooms && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          <Bath className="w-3 h-3 mr-1" />
                          {property.bathrooms}
                        </Badge>
                      )}
                      {property.area_sqft && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          <Square className="w-3 h-3 mr-1" />
                          {property.area_sqft} sqft
                        </Badge>
                      )}
                    </div>

                    {property.address && (
                      <div className="flex items-start text-xs text-gray-600 mb-2">
                        <MapPin className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-1">{property.address}</span>
                      </div>
                    )}
                  </div>

                  {property.listing_type && (
                    <Badge variant="outline" className="text-xs border-primary/20 text-primary w-fit">
                      {property.listing_type}
                    </Badge>
                  )}
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
});

