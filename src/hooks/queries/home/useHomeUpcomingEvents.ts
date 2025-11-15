/**
 * Home Page Upcoming Events Hook
 * 
 * Fetches upcoming events for home page (6 items, no pagination).
 */

import { useQuery } from '@tanstack/react-query';
import { homeKeys, homeQueries } from '@/services/queries/home';

export function useHomeUpcomingEvents() {
  return useQuery({
    queryKey: homeKeys.upcomingEvents(),
    queryFn: homeQueries.getUpcomingEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

