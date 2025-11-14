/**
 * Contact Card Component
 * 
 * Displays contact information for the event organizer.
 */

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Phone, User } from 'lucide-react';
import type { HousingEventDetail } from '@/types/housingEvents';

interface ContactCardProps {
  event: HousingEventDetail;
  t: (key: string) => string | undefined;
}

export function ContactCard({
  event,
  t,
}: ContactCardProps) {
  const handleCall = () => {
    if (event.contact) {
      window.location.href = `tel:${event.contact}`;
    }
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6 pt-5 sm:pt-7 space-y-4">
        <h3 className="mb-4">{t('eventDetail.contact') || 'Contact'}</h3>
        
        <div className="space-y-3">
          {event.organizer_name && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('eventDetail.organizer') || 'Organizer'}</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <p className="font-medium">{event.organizer_name}</p>
              </div>
            </div>
          )}

          <Separator />

          {event.contact && (
            <>
              <Button 
                className="w-full gradient-primary" 
                onClick={handleCall}
              >
                <Phone className="mr-2 h-4 w-4" />
                {t('eventDetail.call') || 'Call'} {event.contact}
              </Button>
            </>
          )}
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          {event.contact && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 text-primary" />
              <span>{event.contact}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

