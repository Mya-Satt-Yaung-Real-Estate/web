/**
 * Contact Owner Card Component
 * 
 * Displays owner contact information and actions.
 */

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Phone, Mail } from 'lucide-react';
import type { PublicPropertyContactInfo } from '@/types/publicProperties';

interface ContactOwnerCardProps {
  contactInfo: PublicPropertyContactInfo;
  onContactOwner: () => void;
  t: (key: string) => string | undefined;
}

export function ContactOwnerCard({
  contactInfo,
  onContactOwner,
  t,
}: ContactOwnerCardProps) {
  return (
    <Card>
      <CardContent className="p-6 pt-7 space-y-4">
        <h3 className="mb-4">{t('propertyDetail.contactOwner') || 'Contact Owner'}</h3>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/20">
            {contactInfo.owner_profile_image_url ? (
              <ImageWithFallback
                src={contactInfo.owner_profile_image_url}
                alt={contactInfo.owner_name || 'Owner'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-[#4a9b82] flex items-center justify-center text-white text-lg font-medium">
                {contactInfo.owner_name?.charAt(0)?.toUpperCase() || 'O'}
              </div>
            )}
          </div>
          <div>
            <p>{contactInfo.owner_name || t('propertyDetail.propertyOwner') || 'Property Owner'}</p>
            <p className="text-muted-foreground text-sm">{t('propertyDetail.propertyOwner') || 'Property Owner'}</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button className="w-full gradient-primary" onClick={onContactOwner}>
            <Phone className="mr-2 h-4 w-4" />
            {t('propertyDetail.callOwner') || 'Call Owner'}
          </Button>
        </div>

        <Separator />

        <div className="space-y-2">
          {contactInfo.phone_numbers && contactInfo.phone_numbers.length > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 text-primary" />
              <span className="text-sm">{contactInfo.phone_numbers[0]}</span>
            </div>
          )}
          {contactInfo.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-sm">{contactInfo.email}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

