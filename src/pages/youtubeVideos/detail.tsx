import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, Eye, PlayCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo/SEOHead';
import { ShareModal } from '@/components/ui/ShareModal';
import { useYoutubeVideo, useYoutubeVideos } from '@/hooks/queries/useYoutubeVideos';
import { homeKeys } from '@/services/queries/home';
import { youtubeVideoKeys } from '@/services/queries/youtubeVideos';
import type { YoutubeVideo, YoutubeVideoListResponse } from '@/types/youtubeVideo';
import { formatYoutubeViewCount, getYoutubeEmbedUrl } from '@/utils/youtube';

function RelatedYoutubeVideoCard({ video }: { video: YoutubeVideo }) {
  const embedUrl = getYoutubeEmbedUrl(video.youtube_link);

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
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
            <span className="text-sm font-medium">Watch video</span>
          </a>
        )}
      </div>
      <CardContent className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3">
          <h3 className="line-clamp-1 text-base font-semibold transition-colors group-hover:text-primary">
            {video.name}
          </h3>
        </div>
        {video.description ? (
          <p className="mb-4 line-clamp-2 text-sm leading-6 text-muted-foreground">{video.description}</p>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{formatYoutubeViewCount(video.view_count)}</span>
          </div>
          <Link
            to={`/youtube-videos/${video.slug}`}
            className="text-sm font-semibold text-red-600 transition-colors hover:text-red-700 hover:underline"
          >
            Watch Now
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function YoutubeVideoDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useYoutubeVideo(slug || '');
  const { data: videosData, isLoading: isLoadingVideos } = useYoutubeVideos();
  const video = data?.data;

  const relatedVideos = useMemo(() => {
    if (!videosData?.data || !video) return [];
    return videosData.data.filter((item) => item.slug !== video.slug);
  }, [videosData, video]);

  useEffect(() => {
    if (!video) return;

    const syncVideoViewCount = (item: YoutubeVideo) =>
      item.slug === video.slug ? { ...item, view_count: video.view_count } : item;

    queryClient.setQueriesData<YoutubeVideoListResponse>(
      { queryKey: youtubeVideoKeys.lists() },
      (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map(syncVideoViewCount),
        };
      }
    );

    queryClient.setQueryData(homeKeys.youtubeVideos(), (oldData: any) => {
      if (!Array.isArray(oldData?.data?.data)) return oldData;
      return {
        ...oldData,
        data: {
          ...oldData.data,
          data: oldData.data.data.map(syncVideoViewCount),
        },
      };
    });

    queryClient.invalidateQueries({ queryKey: youtubeVideoKeys.lists() });
    queryClient.invalidateQueries({ queryKey: homeKeys.youtubeVideos() });
  }, [queryClient, video]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="mb-6 h-10 w-36" />
          <Skeleton className="aspect-video w-full rounded-xl" />
          <div className="mt-8 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <h1 className="mb-4 text-2xl font-bold">Video Not Found</h1>
            <p className="mb-6 text-muted-foreground">The YouTube video you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/youtube-videos">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Videos
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const embedUrl = getYoutubeEmbedUrl(video.youtube_link);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
      <SEOHead
        seo={{
          title: video.name,
          description: video.description || 'Jade Celebrity Home Tour video.',
          keywords: 'jade property, celebrity home tour, youtube video',
          image: '/jade.png',
          type: 'video.other',
        }}
        path={`/youtube-videos/${video.slug}`}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link to="/youtube-videos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Videos
            </Link>
          </Button>
        </div>

        <Card className="mb-8 overflow-hidden">
          <div className="relative aspect-video bg-muted">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={video.name}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <a
                href={video.youtube_link}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground transition-colors hover:text-primary"
              >
                <PlayCircle className="h-16 w-16" />
                <span className="font-medium">Watch video</span>
              </a>
            )}
          </div>

          <CardHeader>
            <CardTitle className="text-xl font-bold leading-tight md:text-2xl">
              {video.name}
            </CardTitle>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{formatYoutubeViewCount(video.view_count)}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {(video.description || video.youtube_link) && (
          <Card>
            <CardContent className="p-8 pt-10">
              {video.description ? (
                <p className="whitespace-pre-line text-muted-foreground leading-7">{video.description}</p>
              ) : null}

              <div className="mt-8 flex justify-end border-t pt-6">
                <ShareModal title={video.name} url={window.location.href}>
                  <Button variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share this video
                  </Button>
                </ShareModal>
              </div>
            </CardContent>
          </Card>
        )}

        {(isLoadingVideos || relatedVideos.length > 0) && (
          <section className="mt-12">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="mb-4">More Videos</h2>
                <p className="text-muted-foreground">
                  Watch more videos from Jade Celebrity Home Tour.
                </p>
              </div>
              <Button asChild variant="outline">
                <Link to="/youtube-videos">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {isLoadingVideos ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <Skeleton className="aspect-video w-full" />
                    <div className="space-y-3 p-5 sm:p-6">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedVideos.map((item) => (
                  <RelatedYoutubeVideoCard key={item.id} video={item} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
