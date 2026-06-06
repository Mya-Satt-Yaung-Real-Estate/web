import { queryOptions } from '@tanstack/react-query';
import { youtubeVideosApi } from '../api/youtubeVideos';
import type { YoutubeVideoFilters } from '@/types/youtubeVideo';

export const youtubeVideoKeys = {
  all: ['youtube-videos'] as const,
  lists: () => [...youtubeVideoKeys.all, 'list'] as const,
  list: (filters: YoutubeVideoFilters) => [...youtubeVideoKeys.lists(), filters] as const,
  details: () => [...youtubeVideoKeys.all, 'detail'] as const,
  detail: (slug: string) => [...youtubeVideoKeys.details(), slug] as const,
};

export const youtubeVideoQueries = {
  getYoutubeVideos: (filters: YoutubeVideoFilters = {}) =>
    queryOptions({
      queryKey: youtubeVideoKeys.list(filters),
      queryFn: () => youtubeVideosApi.getYoutubeVideos(filters),
    }),

  getYoutubeVideo: (slug: string) =>
    queryOptions({
      queryKey: youtubeVideoKeys.detail(slug),
      queryFn: () => youtubeVideosApi.getYoutubeVideo(slug),
      enabled: Boolean(slug),
    }),
};
