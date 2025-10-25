import { MapPin, DollarSign, Home, Bed, Bath, Square, Calendar, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface WantedListingCardProps {
  id: string;
  title: string;
  propertyType: string;
  location: string;
  budget: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  postedDate: string;
  status: 'Active' | 'Fulfilled' | 'Expired';
  description?: string;
  poster?: string;
  responses?: number;
  listingType?: 'buyer' | 'renter';
}

export function WantedListingCard({
  title,
  propertyType,
  location,
  budget,
  bedrooms,
  bathrooms,
  area,
  postedDate,
  status,
  description,
  poster = 'Anonymous',
  responses = 0,
  listingType = 'buyer',
}: WantedListingCardProps) {
  const statusColors = {
    Active: 'bg-green-500/10 text-green-600 border-green-500/20',
    Fulfilled: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    Expired: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
  };

  return (
    <Card className="group hover:shadow-xl transition-all border-border/50 backdrop-blur-sm h-full flex flex-col overflow-hidden">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-primary/5 border-primary/20">
                <Home className="h-3 w-3 mr-1" />
                {propertyType}
              </Badge>
              <Badge 
                variant="outline" 
                className={listingType === 'buyer' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'bg-purple-500/10 text-purple-600 border-purple-500/20'}
              >
                {listingType === 'buyer' ? 'Buyer' : 'Renter'}
              </Badge>
              <Badge 
                variant="outline" 
                className={statusColors[status]}
              >
                {status}
              </Badge>
            </div>
          </div>
        </div>

        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4 text-primary flex-shrink-0" />
            <span>{budget}</span>
          </div>

          {/* Property specs */}
          <div className="flex flex-wrap gap-3 pt-2">
            {bedrooms && (
              <div className="flex items-center gap-1.5 text-sm">
                <Bed className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{bedrooms} Beds</span>
              </div>
            )}
            {bathrooms && (
              <div className="flex items-center gap-1.5 text-sm">
                <Bath className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{bathrooms} Baths</span>
              </div>
            )}
            {area && (
              <div className="flex items-center gap-1.5 text-sm">
                <Square className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{area}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border/50 space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Posted {new Date(postedDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{responses} responses</span>
            </div>
          </div>

          <Button 
            className="w-full gradient-primary shadow-lg shadow-primary/25 hover:shadow-primary/40"
            size="sm"
          >
            Contact {poster}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
