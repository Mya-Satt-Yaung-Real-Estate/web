import { Calendar, Image as ImageIcon } from 'lucide-react';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Activity } from '@/types/activity';

interface CompanyActivityListCardProps {
  activity: Activity;
}

function getImageUrl(activity: Activity): string | undefined {
  const primary = activity.primary_image || activity.media?.primary_image;
  if (primary) {
    return primary.url || primary.medium_url || primary.small_url || primary.thumbnail_url;
  }
  return activity.media?.images?.[0]?.url
    || activity.media?.images?.[0]?.medium_url
    || activity.media?.images?.[0]?.thumbnail_url;
}

function formatDate(value?: string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export function CompanyActivityListCard({ activity }: CompanyActivityListCardProps) {
  const { t, language } = useLanguage();
  const imageUrl = getImageUrl(activity);

  return (
    <Card className="group overflow-hidden border border-border/50 transition-all hover:border-primary/30 hover:shadow-lg">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5">
        <div className={`relative h-52 w-full shrink-0 overflow-hidden rounded-lg sm:h-48 sm:w-64 ${imageUrl ? '' : 'flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5'}`}>
          {imageUrl ? (
            <ImageWithFallback
              src={imageUrl}
              alt={activity.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold transition-colors group-hover:text-primary sm:text-xl">
            {activity.title}
          </h3>
          <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
            {activity.description || (language === 'mm' ? 'ဖော်ပြချက်မရှိပါ။' : 'No description provided.')}
          </p>
          <div className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{t('myWantedList.posted')} {formatDate(activity.published_at || activity.created_at)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
