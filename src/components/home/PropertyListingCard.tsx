import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MapPin, Bed, Bath, Square, Heart, MessageCircle, Share2 } from 'lucide-react';
import { ImageWithFallback } from '../ImageWithFallback';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface PropertyListingCardProps {
  id: string;
  image: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  type: string;
  featured?: boolean;
  likes?: number;
  comments?: number;
}

export function PropertyListingCard({
  id,
  image,
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  area,
  type,
  featured,
  likes = 0,
  comments = 0,
}: PropertyListingCardProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: `Check out this property: ${title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (error: any) {
      // If share is cancelled or fails, fall back to clipboard
      if (error.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(window.location.href);
        } catch {
          console.error('Unable to share or copy link');
        }
      }
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-border/50 backdrop-blur-sm h-full flex flex-col">
      <div className="relative overflow-hidden aspect-[4/3]">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {featured && (
            <Badge className="gradient-primary text-white border-0 shadow-lg">
              {t('listings.featured')}
            </Badge>
          )}
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {type}
          </Badge>
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
            }`}
          />
        </button>

        {/* Price */}
        <div className="absolute bottom-3 left-3">
          <span className="text-white px-3 py-1.5 rounded-lg bg-background/20 backdrop-blur-md border border-white/20">
            {price}
          </span>
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <h4 className="mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h4>
        
        <div className="flex items-center gap-1 text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </div>

        <div className="flex items-center gap-4 text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Bed className="h-4 w-4" />
            <span>{bedrooms}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="h-4 w-4" />
            <span>{bathrooms}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Square className="h-4 w-4" />
            <span>{area}</span>
          </div>
        </div>

        {/* Social Actions */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/50">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
            <span className="text-muted-foreground">{likeCount}</span>
          </button>
          <button
            onClick={() => navigate(`/property/${id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{comments}</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors ml-auto"
          >
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <Button 
          onClick={() => navigate(`/property/${id}`)}
          className="w-full mt-auto gradient-primary group-hover:shadow-lg transition-all"
        >
          {t('listings.viewDetails')}
        </Button>
      </CardContent>
    </Card>
  );
}
