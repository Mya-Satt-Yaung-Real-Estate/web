/**
 * Advertisement Card Simple Component
 * 
 * Simplified advertisement card for carousel display.
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { ExternalLink } from 'lucide-react';

interface AdvertisementCardSimpleProps {
  id: string;
  image: string;
  title: string;
  description: string;
  promoted: boolean;
}

export function AdvertisementCardSimple({
  image,
  title,
  description,
  promoted,
}: AdvertisementCardSimpleProps) {
  return (
    <Card className="group hover:shadow-xl transition-all border-border/50 hover:border-primary/50 overflow-hidden h-full">
      <div className="relative h-40 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {promoted && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white border-0 text-xs">
            Promoted
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
          {description}
        </p>
        
        <div className="flex items-center text-primary text-sm font-medium group-hover:underline">
          Learn More
          <ExternalLink className="ml-1 h-3 w-3" />
        </div>
      </CardContent>
    </Card>
  );
}
