/**
 * Contact Card Component
 * 
 * Displays contact information for the advertisement.
 */

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Phone, Mail } from 'lucide-react';
import type { PublicAdvertisementDetailContactInfo } from '@/types/publicAdvertisements';

interface ContactCardProps {
  contactInfo: PublicAdvertisementDetailContactInfo;
  t: (key: string) => string | undefined;
}

export function ContactCard({
  contactInfo,
  t,
}: ContactCardProps) {
  const handleCall = () => {
    if (contactInfo.phone_numbers && contactInfo.phone_numbers.length > 0) {
      window.location.href = `tel:${contactInfo.phone_numbers[0]}`;
    }
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6 pt-5 sm:pt-7 space-y-4">
        <h3 className="mb-4">{t('advertisementDetail.contact') || 'Contact'}</h3>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{t('advertisementDetail.name') || 'Name'}</p>
            <p className="font-medium">{contactInfo.contact_name}</p>
          </div>

          <Separator />

          {contactInfo.phone_numbers && contactInfo.phone_numbers.length > 0 && (
            <>
              <Button 
                className="w-full gradient-primary" 
                onClick={handleCall}
              >
                <Phone className="mr-2 h-4 w-4" />
                {t('advertisementDetail.call') || 'Call'} {contactInfo.phone_numbers[0]}
              </Button>
            </>
          )}
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          {contactInfo.phone_numbers && contactInfo.phone_numbers.length > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 text-primary" />
              <span>{contactInfo.phone_numbers[0]}</span>
            </div>
          )}
          {contactInfo.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 text-primary" />
              <span className="break-all">{contactInfo.email}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

