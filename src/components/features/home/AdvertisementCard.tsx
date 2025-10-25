/**
 * Advertisement Card Component
 * 
 * Displays advertisement information in a card format.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { ExternalLink, Calendar, Building2 } from 'lucide-react';

interface AdvertisementCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  company: string;
  category: string;
  validUntil: string;
  promoted: boolean;
}

export function AdvertisementCard({
  image,
  title,
  description,
  company,
  category,
  validUntil,
  promoted,
}: AdvertisementCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all border-border/50 hover:border-primary/50 overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {promoted && (
          <Badge className="absolute top-4 left-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white border-0">
            Promoted
          </Badge>
        )}
        <Badge variant="secondary" className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm">
          {category}
        </Badge>
      </div>
      
      <CardHeader>
        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <span>{company}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {description}
        </p>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar className="h-4 w-4" />
          <span>Valid until {validUntil}</span>
        </div>
        
        <Button className="w-full group-hover:bg-primary group-hover:text-white transition-all" variant="outline">
          Learn More
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
