/**
 * Contact Owner Card Component
 *
 * Displays owner contact information and actions.
 * When locked (direct_owner), shows blurred placeholder and unlock CTA.
 */

import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Phone, Mail, Building2, Lock } from 'lucide-react';
import type { PublicPropertyContactInfo } from '@/types/publicProperties';

interface ContactOwnerCardProps {
  contactInfo: PublicPropertyContactInfo;
  onContactOwner: () => void;
  t: (key: string) => string | undefined;
  isLocked?: boolean;
  unlockPointAmount?: number | null;
  language?: 'en' | 'mm';
  onRequestUnlock?: () => void;
}

export function ContactOwnerCard({
  contactInfo,
  onContactOwner,
  t,
  isLocked = false,
  unlockPointAmount = null,
  language = 'en',
  onRequestUnlock,
}: ContactOwnerCardProps) {
  const companyDetailPath =
    contactInfo.is_company && contactInfo.company_slug
      ? `/companies/${contactInfo.company_slug}`
      : null;

  const companyLinkHint = companyDetailPath
    ? t('propertyDetail.clickToSeeCompany') || 'Click to see company information'
    : undefined;

  if (isLocked) {
    return (
      <Card>
        <CardContent className="p-6 pt-7 space-y-4">
          <h3 className="mb-4">{t('propertyDetail.contactOwner') || 'Contact Owner'}</h3>
          <div
            className="relative min-h-[220px] overflow-hidden rounded-lg cursor-pointer"
            role="button"
            aria-label={
              language === 'mm'
                ? 'ဆက်သွယ်ရန်အချက်အလက် လော့ခ်ထားပြီး ပွိုင့်ဖြင့် ဖွင့်ရန်'
                : 'Contact information is locked. Tap to unlock with points.'
            }
            tabIndex={0}
            onClick={onRequestUnlock}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onRequestUnlock?.();
            }}
          >
            <div className="pointer-events-none select-none space-y-3 p-1 blur-sm contrast-[0.9]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-[#4a9b82] flex items-center justify-center text-white text-lg font-medium shrink-0">
                  O
                </div>
                <div>
                  <p>Property Owner</p>
                  <p className="text-muted-foreground text-sm">Owner</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm">09 123 456 789</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm">owner@example.com</span>
                </div>
              </div>
              <Button className="w-full gradient-primary">
                <Phone className="mr-2 h-4 w-4" />
                Call Owner
              </Button>
            </div>
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/12 via-background/24 to-background/36"
              aria-hidden
            />
            <div className="pointer-events-none absolute left-2 top-2">
              <Badge
                variant="secondary"
                className="gap-1 text-[11px] border-amber-300/50 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800"
              >
                <Lock className="h-3 w-3 text-amber-600" />
                {language === 'mm' ? 'လော့ခ်' : 'Locked'}
                {unlockPointAmount != null
                  ? language === 'mm'
                    ? ` • ${unlockPointAmount} ပွိုင့်`
                    : ` • ${unlockPointAmount} points`
                  : ' • ...'}
              </Badge>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-3 text-center">
              <p className="text-xs text-muted-foreground">
                {language === 'mm'
                  ? 'ဆက်သွယ်ရန်အချက်အလက် ဖွင့်ရန် နှိပ်ပါ'
                  : 'Tap to unlock and view contact details'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const avatarBlock = (
    <>
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
    </>
  );

  const nameText =
    contactInfo.owner_name || t('propertyDetail.propertyOwner') || 'Property Owner';

  return (
    <Card>
      <CardContent className="p-6 pt-7 space-y-4">
        <h3 className="mb-4">{t('propertyDetail.contactOwner') || 'Contact Owner'}</h3>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/20 shrink-0">
            {companyDetailPath ? (
              <Link
                to={companyDetailPath}
                className="block h-full w-full"
                title={companyLinkHint}
              >
                {avatarBlock}
              </Link>
            ) : (
              avatarBlock
            )}
          </div>
          <div>
            {companyDetailPath ? (
              <Link
                to={companyDetailPath}
                className="text-inherit hover:underline"
                title={companyLinkHint}
              >
                <p>{nameText}</p>
              </Link>
            ) : (
              <p>{nameText}</p>
            )}
            {contactInfo.is_company && contactInfo.company_name ? (
              companyDetailPath ? (
                <Link
                  to={companyDetailPath}
                  className="text-sm text-primary hover:text-primary/90 hover:underline font-medium"
                  title={companyLinkHint}
                >
                  {contactInfo.company_name}
                </Link>
              ) : (
                <p className="text-sm text-primary font-medium">{contactInfo.company_name}</p>
              )
            ) : (
              <p className="text-muted-foreground text-sm">
                {t('propertyDetail.propertyOwner') || 'Property Owner'}
              </p>
            )}
          </div>
        </div>

        {companyDetailPath ? (
          <Button asChild variant="outline" className="w-full" size="sm">
            <Link to={companyDetailPath} title={companyLinkHint}>
              <Building2 className="mr-2 h-4 w-4 shrink-0" />
              {t('propertyDetail.visitCompany') || 'View company profile'}
            </Link>
          </Button>
        ) : null}

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

        <Button
          className="w-full gradient-primary"
          onClick={onContactOwner}
          disabled={!contactInfo.phone_numbers?.length}
        >
          <Phone className="mr-2 h-4 w-4" />
          {t('propertyDetail.callOwner') || 'Call Owner'}
        </Button>
      </CardContent>
    </Card>
  );
}
