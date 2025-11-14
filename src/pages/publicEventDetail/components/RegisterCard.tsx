/**
 * Register Card Component
 * 
 * Displays registration button for events that require registration.
 */

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import type { HousingEventDetail } from '@/types/housingEvents';

interface RegisterCardProps {
  event: HousingEventDetail;
  onRegister: () => void;
  isRegistering?: boolean;
  t: (key: string) => string | undefined;
}

export function RegisterCard({
  event,
  onRegister,
  isRegistering = false,
  t,
}: RegisterCardProps) {
  if (!event.need_registration) return null;

  return (
    <Card>
      <CardContent className="p-4 sm:p-6 pt-5 sm:pt-7">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{t('eventDetail.registration') || 'Registration'}</h3>
              <p className="text-sm text-muted-foreground">
                {event.registered_user_count} / {event.accepted_user_count} {t('events.registered') || 'registered'}
              </p>
            </div>
          </div>

          <Button 
            className="w-full gradient-primary shadow-lg shadow-primary/25 hover:shadow-primary/40"
            onClick={onRegister}
            disabled={isRegistering || event.is_already_registered}
          >
            {isRegistering 
              ? (t('eventDetail.registering') || 'Registering...')
              : event.is_already_registered
              ? (t('eventDetail.alreadyRegistered') || 'Already Registered')
              : (t('eventDetail.register') || 'Register')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

