import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, PlayCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { SEOHead } from '@/components/seo/SEOHead';
import { useYoutubeVideos } from '@/hooks/queries/useYoutubeVideos';
import type { YoutubeVideo } from '@/types/youtubeVideo';
import { formatYoutubeViewCount, getYoutubeEmbedUrl } from '@/utils/youtube';

const ITEMS_PER_PAGE = 9;

function YoutubeVideoCard({ video }: { video: YoutubeVideo }) {
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
            <span className="text-sm font-medium">Open YouTube video</span>
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

export default function YoutubeVideosPage() {
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useYoutubeVideos({
    page: currentPage,
    per_page: ITEMS_PER_PAGE,
    search: searchTerm || undefined,
  });

  const videos = useMemo(() => data?.data || [], [data]);
  const totalPages = data?.pagination?.last_page || 1;

  const handleSearch = () => {
    setSearchTerm(searchInput.trim());
    setCurrentPage(1);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-24 pb-12">
      <SEOHead
        seo={{
          title: 'Jade Celebrity Home Tour',
          description: 'Watch the latest property videos and home tours from Jade Property.',
          keywords: 'jade property, celebrity home tour, youtube videos, property videos',
          image: '/jade.png',
          type: 'website',
        }}
        path="/youtube-videos"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="bg-gradient-to-r from-primary via-[#4a9b82] to-primary bg-clip-text text-transparent">
            Jade Celebrity Home Tour
          </h1>
          <p className="mt-2 text-muted-foreground">
            Watch the latest property videos and updates from Jade Property.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search videos..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="pl-10"
              autoComplete="off"
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
          {(searchInput || searchTerm) && (
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          )}
        </div>

        {error ? (
          <div className="py-12 text-center">
            <p className="mb-4 text-red-500">Failed to load YouTube videos. Please try again later.</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
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
        ) : videos.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No videos found</h3>
            <p className="mb-4 text-muted-foreground">Try adjusting your search keywords.</p>
            <Button variant="outline" onClick={handleClear}>Clear Search</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <YoutubeVideoCard key={video.id} video={video} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="mt-12"
            />
          </>
        )}
      </div>
    </div>
  );
}
