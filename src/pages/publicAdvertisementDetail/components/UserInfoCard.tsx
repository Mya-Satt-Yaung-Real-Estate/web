/**
 * User Info Card Component
 * 
 * Displays information about the user who posted the advertisement.
 */

import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatMemberLevelLabel, getMemberLevelBadgeClass } from '@/lib/memberLevel';
import type { PublicAdvertisementDetailUser } from '@/types/publicAdvertisements';

interface UserInfoCardProps {
  user: PublicAdvertisementDetailUser;
  t: (key: string) => string | undefined;
}

export function UserInfoCard({
  user,
  t,
}: UserInfoCardProps) {
  const companyDetailPath =
    user.is_company && user.company_slug
      ? `/companies/${user.company_slug}`
      : null;

  const companyLinkHint = companyDetailPath
    ? t('propertyDetail.clickToSeeCompany') || 'Click to see company information'
    : undefined;

  const avatarBlock = (
    <>
      {user.profile_image_url ? (
        <ImageWithFallback
          src={user.profile_image_url}
          alt={user.name || 'User'}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-[#4a9b82] text-sm font-medium text-white">
          {user.name?.charAt(0)?.toUpperCase() ?? '?'}
        </div>
      )}
    </>
  );

  return (
    <Card>
      <CardContent className="space-y-4 p-4 pt-5 sm:p-6 sm:pt-7">
        <h3 className="mb-4">{t('advertisementDetail.postedBy') || 'Posted By'}</h3>
        
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20">
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
                className="font-medium hover:underline"
                title={companyLinkHint}
              >
                {user.name}
              </Link>
            ) : (
              <p className="font-medium">{user.name}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {user.user_type === 'company' 
                ? (t('advertisementDetail.company') || 'Company')
                : (t('advertisementDetail.individual') || 'Individual')}
            </p>
            {user.member_level && (
              <Badge variant="outline" className={`mt-1 text-xs ${getMemberLevelBadgeClass(user.member_level)}`}>
                {formatMemberLevelLabel(user.member_level)}
              </Badge>
            )}
          </div>
        </div>

        {companyDetailPath && (
          <Button asChild variant="outline" className="w-full" size="sm">
            <Link to={companyDetailPath}>
              <Building2 className="mr-2 h-4 w-4 shrink-0" />
              {t('propertyDetail.visitCompany') || 'View company profile'}
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
