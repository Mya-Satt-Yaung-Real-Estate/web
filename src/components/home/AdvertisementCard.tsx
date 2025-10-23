import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Calendar, ExternalLink, Star } from 'lucide-react';
import { ImageWithFallback } from '../ImageWithFallback';
import { useLanguage } from '../../contexts/LanguageContext';

interface AdvertisementCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  company: string;
  category: string;
  validUntil: string;
  promoted?: boolean;
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
  const { t } = useLanguage();
  
  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-border/50 backdrop-blur-sm h-full flex flex-col">
      <div className="relative overflow-hidden aspect-video">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {promoted && (
            <Badge className="bg-amber-500 text-white border-0 shadow-lg">
              <Star className="h-3 w-3 mr-1 fill-white" />
              {t('ads.promoted')}
            </Badge>
          )}
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {category}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="mb-2">
          <span className="text-muted-foreground">{company}</span>
        </div>
        
        <h4 className="mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h4>
        
        <p className="text-muted-foreground mb-4 line-clamp-2 flex-1">
          {description}
        </p>

        <div className="flex items-center gap-2 text-muted-foreground mb-4 pb-4 border-b border-border/50">
          <Calendar className="h-4 w-4" />
          <span>{t('ads.validUntil')} {validUntil}</span>
        </div>

        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
          {t('ads.learnMore')}
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
