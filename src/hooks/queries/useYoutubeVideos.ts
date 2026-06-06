import { useQuery } from '@tanstack/react-query';
import { youtubeVideoQueries } from '@/services/queries/youtubeVideos';
import type { YoutubeVideoFilters } from '@/types/youtubeVideo';

export function useYoutubeVideos(filters: YoutubeVideoFilters = {}) {
  return useQuery(youtubeVideoQueries.getYoutubeVideos(filters));
}

export function useYoutubeVideo(slug: string) {
  return useQuery(youtubeVideoQueries.getYoutubeVideo(slug));
}
