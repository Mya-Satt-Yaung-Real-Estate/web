/**
 * Home Event Card Component
 * 
 * Event card component specifically for home page.
 * Matches the design from public properties event list page (100% same design).
 * Not reusable - specific to home page feature for easy maintenance.
 */

import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import {
  Calendar,
  MapPin,
  Clock,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { HousingEvent } from '@/types/housingEvents';

interface HomeEventCardProps {
  event: HousingEvent;
}

export function HomeEventCard({ event }: HomeEventCardProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const getName = () => {
    return language === 'mm' ? event.name_mm : event.name_en;
  };

  const getCategoryName = () => {
    return language === 'mm' ? event.category.name_mm : event.category.name_en;
  };

  const getRegionName = () => {
    return language === 'mm' ? event.region.name_mm : event.region.name_en;
  };

  const getTownshipName = () => {
    return language === 'mm' ? event.township.name_mm : event.township.name_en;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'mm' ? 'my-MM' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) return '';
    // Assuming time is in format like "09:00:00" or "09:00"
    const time = timeString.split(':').slice(0, 2).join(':');
    return time;
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        {event.images && (
          <div className="relative h-48 w-full overflow-hidden">
            <ImageWithFallback
              src={event.images.url}
              alt={getName()}
              className="w-full h-full object-cover"
            />
            {/* Category - Top Left */}
            <div className="absolute top-2 left-2 z-10">
              <Badge className="bg-background/90 backdrop-blur-sm text-foreground border-0">
                {getCategoryName()}
              </Badge>
            </div>
            {/* Free Badge - Top Right */}
            {event.is_free && (
              <div className="absolute top-2 right-2 z-10">
                <Badge className="bg-yellow-500 text-white border-0">
                  {t('events.free') || 'Free'}
                </Badge>
              </div>
            )}
          </div>
        )}
      </div>

      <CardContent className="p-3 sm:p-4 pt-4 sm:pt-5">
        <div className="space-y-2 sm:space-y-3">
          {/* Title */}
          <h4 className="mb-1.5 sm:mb-2 text-sm sm:text-base line-clamp-1 group-hover:text-primary transition-colors">
            {getName()}
          </h4>

          {/* Date */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            <span>{formatDate(event.date)}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            <span className="line-clamp-1">
              {(() => {
                const parts: string[] = [];
                if (event.location) {
                  parts.push(event.location);
                }
                if (event.township && event.region) {
                  parts.push(`${getTownshipName()}, ${getRegionName()}`);
                }
                return parts.join(', ') || '';
              })()}
            </span>
          </div>

          {/* Start Time and End Time */}
          {event.start_time || event.end_time ? (
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              <span>
                {formatTime(event.start_time) && formatTime(event.end_time)
                  ? `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`
                  : formatTime(event.start_time) || formatTime(event.end_time) || ''}
              </span>
            </div>
          ) : null}

          {/* View Details Button */}
          <Button 
            onClick={() => {
              // Navigate to event detail using slug if available, otherwise use id
              navigate(event.slug ? `/events/${event.slug}` : `/events/${event.id}`);
            }}
            className="w-full text-xs sm:text-sm gradient-primary shadow-lg shadow-primary/25 hover:shadow-primary/40"
            size="sm"
          >
            {t('events.viewDetails') || 'View Details'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

