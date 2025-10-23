import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Clock, MapPin, Users } from 'lucide-react';
import { ImageWithFallback } from '../ImageWithFallback';
import { useLanguage } from '../../contexts/LanguageContext';

interface EventCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  category: string;
  status?: 'upcoming' | 'ongoing' | 'past';
}

export function EventCard({
  image,
  title,
  description,
  date,
  time,
  location,
  attendees,
  category,
  status = 'upcoming',
}: EventCardProps) {
  const { t } = useLanguage();
  
  const getStatusBadge = () => {
    switch (status) {
      case 'ongoing':
        return <Badge className="bg-green-500 text-white border-0">{t('events.liveNow')}</Badge>;
      case 'upcoming':
        return <Badge className="gradient-primary text-white border-0">{t('events.upcoming')}</Badge>;
      case 'past':
        return <Badge variant="secondary">{t('events.ended')}</Badge>;
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-border/50 backdrop-blur-sm h-full flex flex-col">
      <div className="relative overflow-hidden aspect-video">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Date Badge */}
        <div className="absolute top-3 left-3">
          <div className="bg-background/95 backdrop-blur-sm rounded-xl p-3 text-center shadow-lg">
            <div className="text-primary">{date.split(' ')[0]}</div>
            <div className="text-muted-foreground -mt-1">{date.split(' ')[1]}</div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {getStatusBadge()}
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <Badge variant="outline" className="w-fit mb-3 border-primary/20 bg-primary/5 text-primary">
          {category}
        </Badge>
        
        <h4 className="mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h4>
        
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-primary flex-shrink-0" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4 text-primary flex-shrink-0" />
            <span>{attendees} {t('events.attending')}</span>
          </div>
        </div>

        <Button 
          className="w-full gradient-primary group-hover:shadow-lg transition-all"
          disabled={status === 'past'}
        >
          {status === 'past' ? t('events.eventEnded') : t('events.registerNow')}
        </Button>
      </CardContent>
    </Card>
  );
}
