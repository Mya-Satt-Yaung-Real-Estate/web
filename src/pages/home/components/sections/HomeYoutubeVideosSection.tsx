import { memo, useMemo } from 'react';
import { ArrowRight, Eye, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHomeYoutubeVideos } from '@/hooks/queries/home';
import type { YoutubeVideo } from '@/types/youtubeVideo';
import { formatYoutubeViewCount, getYoutubeEmbedUrl } from '@/utils/youtube';

function YoutubeVideoCard({ video }: { video: YoutubeVideo }) {
  const { t } = useLanguage();
  const embedUrl = getYoutubeEmbedUrl(video.youtube_link);

  return (
    <Card className="flex h-full flex-col overflow-hidden border-border/50 shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
      <div className="relative aspect-video bg-muted">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={video.name}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <a
            href={video.youtube_link}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground transition-colors hover:text-primary"
          >
            <PlayCircle className="h-12 w-12" />
            <span className="text-sm font-medium">{t('homeTour.openVideo')}</span>
          </a>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3">
          <h3 className="line-clamp-1 text-base font-semibold">{video.name}</h3>
        </div>
        {video.description ? (
          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{video.description}</p>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{formatYoutubeViewCount(video.view_count, t('homeTour.views'))}</span>
          </div>
          <Link
            to={`/youtube-videos/${video.slug}`}
            className="text-sm font-semibold text-red-600 transition-colors hover:text-red-700 hover:underline"
          >
            {t('homeTour.watchNow')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export const HomeYoutubeVideosSection = memo(function HomeYoutubeVideosSection() {
  const { t } = useLanguage();
  const { data, isLoading, error } = useHomeYoutubeVideos();

  const videos = useMemo(() => {
    if (!data?.data?.data) return [];
    return data.data.data;
  }, [data]);

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <Skeleton className="mb-4 h-8 w-56" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || videos.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h2>{t('homeTour.title')}</h2>
            <p className="mt-4 text-muted-foreground">{t('homeTour.subtitle')}</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/youtube-videos">
              {t('homeTour.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <YoutubeVideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
});
