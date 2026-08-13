import { useNavigate } from 'react-router-dom';
import { Calendar, Image as ImageIcon } from 'lucide-react';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Activity } from '@/types/activity';

interface CompanyActivityGridCardProps {
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

export function CompanyActivityGridCard({ activity }: CompanyActivityGridCardProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const imageUrl = getImageUrl(activity);
  const goToDetail = () => navigate(`/activities/${activity.slug}`);

  return (
    <Card className="group flex h-full flex-col overflow-hidden border border-border/50 shadow-lg transition-all hover:border-primary/30 hover:shadow-xl">
      <div
        className={`relative h-48 cursor-pointer overflow-hidden ${imageUrl ? '' : 'flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5'}`}
        onClick={goToDetail}
      >
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

      <CardHeader className="space-y-2 pb-3">
        <h3
          className="line-clamp-2 cursor-pointer text-lg font-semibold transition-colors group-hover:text-primary"
          onClick={goToDetail}
        >
          {activity.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {activity.description || (language === 'mm' ? 'ဖော်ပြချက်မရှိပါ။' : 'No description provided.')}
        </p>
      </CardHeader>

      <CardContent className="mt-auto space-y-3 pt-0">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{t('myWantedList.posted')} {formatDate(activity.published_at || activity.created_at)}</span>
        </div>
        <Button
          onClick={goToDetail}
          variant="outline"
          size="sm"
          className="w-full text-xs transition-all group-hover:border-0 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-[#4a9b82] group-hover:text-white group-hover:shadow-lg hover:border-0 hover:bg-gradient-to-r hover:from-primary hover:to-[#4a9b82] hover:text-white hover:shadow-lg sm:text-sm"
        >
          {t('listings.viewDetails') || 'View Details'}
        </Button>
      </CardContent>
    </Card>
  );
}
