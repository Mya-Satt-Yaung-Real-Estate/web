/**
 * Premium Post Card Component
 * 
 * Displays premium property posts in a card format.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { 
  Heart, 
  MessageCircle, 
  Eye, 
  TrendingUp, 
  Bed, 
  Bath, 
  Square, 
  MapPin,
  ArrowRight 
} from 'lucide-react';

interface PremiumPostCardProps {
  id: string;
  image: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  type: string;
  views: number;
  trending: boolean;
  likes: number;
  comments: number;
}

export function PremiumPostCard({
  image,
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  area,
  type,
  views,
  trending,
  likes,
  comments,
}: PremiumPostCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all border-border/50 hover:border-primary/50 overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {trending && (
          <Badge className="absolute top-4 left-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white border-0">
            <TrendingUp className="h-3 w-3 mr-1" />
            Trending
          </Badge>
        )}
        <Badge variant="secondary" className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm">
          {type}
        </Badge>
      </div>
      
      <CardHeader>
        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{location}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">{price}</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{area}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{comments}</span>
              </div>
            </div>
          </div>
        </div>
        
        <Button className="w-full group-hover:bg-primary group-hover:text-white transition-all" variant="outline">
          View Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
