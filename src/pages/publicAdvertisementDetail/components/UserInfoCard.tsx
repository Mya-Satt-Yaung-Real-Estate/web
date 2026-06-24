/**
 * User Info Card Component
 * 
 * Displays information about the user who posted the advertisement.
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  return (
    <Card>
      <CardContent className="p-4 sm:p-6 pt-5 sm:pt-7 space-y-4">
        <h3 className="mb-4">{t('advertisementDetail.postedBy') || 'Posted By'}</h3>
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-[#4a9b82] flex items-center justify-center text-white font-medium">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{user.name}</p>
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
      </CardContent>
    </Card>
  );
}

