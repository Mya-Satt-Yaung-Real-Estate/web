import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ShareModal } from '@/components/ui/ShareModal';
import { Calendar, Share2 } from 'lucide-react';
import type { Activity } from '@/types/activity';

interface ActivityDetailsCardProps {
  activity: Activity;
  formatTimestamp: (dateString: string) => string;
  t: (key: string) => string | undefined;
}

export function ActivityDetailsCard({ activity, formatTimestamp, t }: ActivityDetailsCardProps) {
  const publishedAt = activity.published_at || activity.created_at;

  return (
    <Card>
      <CardContent className="p-4 sm:p-6 pt-5 sm:pt-7 space-y-4 sm:space-y-6">
        <div>
          <h1 className="mb-2 text-lg sm:text-xl lg:text-2xl">{activity.title}</h1>
        </div>

        <Separator />

        <div>
          <h3 className="mb-2 text-sm font-semibold">{t('activityDetail.description') || 'Description'}</h3>
          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {activity.description || t('activityDetail.noDescription') || 'No description provided.'}
          </p>
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {t('activityDetail.publishedOn') || 'Published on'}: {formatTimestamp(publishedAt)}
            </span>
          </div>
          <ShareModal title={activity.title} url={window.location.href}>
            <Button
              variant="outline"
              size="sm"
              className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10 hover:text-primary hover:border-primary/20"
            >
              <Share2 className="h-4 w-4 mr-2" />
              {t('activityDetail.share') || 'Share'}
            </Button>
          </ShareModal>
        </div>
      </CardContent>
    </Card>
  );
}
