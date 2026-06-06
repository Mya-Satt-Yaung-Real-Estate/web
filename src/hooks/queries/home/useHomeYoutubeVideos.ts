/**
 * Home Page YouTube Videos Hook
 *
 * Fetches the latest active YouTube videos for the home page.
 */

import { useQuery } from '@tanstack/react-query';
import { homeKeys, homeQueries } from '@/services/queries/home';

export function useHomeYoutubeVideos() {
  return useQuery({
    queryKey: homeKeys.youtubeVideos(),
    queryFn: homeQueries.getHomeYoutubeVideos,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
