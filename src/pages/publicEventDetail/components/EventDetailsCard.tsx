/**
 * Event Details Card Component
 * 
 * Displays event details with description and information.
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ShareModal } from '@/components/ui/ShareModal';
import {
  MapPin,
  Calendar,
  Clock,
  Share2,
  Tag,
  DollarSign,
  Users,
  Monitor,
} from 'lucide-react';
import type { HousingEventDetail } from '@/types/housingEvents';

interface EventDetailsCardProps {
  event: HousingEventDetail;
  title: string;
  description: string;
  locationString: string;
  formatDate: (dateString: string) => string;
  formatTime: (timeString: string) => string;
  t: (key: string) => string | undefined;
}

export function EventDetailsCard({
  event,
  title,
  description,
  locationString,
  formatDate,
  formatTime,
  t,
}: EventDetailsCardProps) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6 pt-5 sm:pt-7 space-y-4 sm:space-y-6">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-2">
            <div className="flex-1">
              <h1 className="mb-2 text-lg sm:text-xl lg:text-2xl">{title}</h1>
              {locationString && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{locationString}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Online Event Notice */}
        {event.is_online && (
          <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
              <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-blue-900 dark:text-blue-100">
              {t('eventDetail.onlineEvent') || 'This event is online, not in class'}
            </p>
          </div>
        )}

        {/* Event Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">{t('eventDetail.date') || 'Date'}</p>
              <p className="font-medium">{formatDate(event.date)}</p>
            </div>
          </div>

          {(event.start_time || event.end_time) && (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">{t('eventDetail.time') || 'Time'}</p>
                <p className="font-medium">
                  {formatTime(event.start_time) && formatTime(event.end_time)
                    ? `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`
                    : formatTime(event.start_time) || formatTime(event.end_time) || '-'}
                </p>
              </div>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">{t('eventDetail.price') || 'Price'}</p>
              <p className="font-medium">
                {event.is_free 
                  ? (t('events.free') || 'Free')
                  : event.price || '-'}
              </p>
            </div>
          </div>

          {/* Registration Info */}
          {event.need_registration && (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">{t('eventDetail.registration') || 'Registration'}</p>
                <p className="font-medium">
                  {event.registered_user_count} / {event.accepted_user_count} {t('events.registered') || 'registered'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {event.tag && event.tag.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-semibold mb-2">{t('eventDetail.tags') || 'Tags'}</p>
              <div className="flex flex-wrap gap-2">
                {event.tag.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Description */}
        <div>
          <h3 className="mb-2 text-sm font-semibold">{t('eventDetail.description') || 'Description'}</h3>
          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {description || t('eventDetail.noDescription') || 'No description provided.'}
          </p>
        </div>

        <Separator />

        {/* Posted Date and Share */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {t('eventDetail.publishedOn') || 'Published on'}: {formatDate(event.date)}
            </span>
          </div>
          <ShareModal title={title} url={window.location.href}>
            <Button variant="outline" size="sm" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10 hover:text-primary hover:border-primary/20">
              <Share2 className="h-4 w-4 mr-2" />
              {t('eventDetail.share') || 'Share'}
            </Button>
          </ShareModal>
        </div>
      </CardContent>
    </Card>
  );
}

