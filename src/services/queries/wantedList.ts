import { wantedListApi } from '../api/wantedList';
import type { WantedListFilters } from '../api/wantedList';

export const wantedListKeys = {
  all: ['wanted-lists'] as const,
  lists: () => [...wantedListKeys.all, 'list'] as const,
  list: (filters?: WantedListFilters) => [...wantedListKeys.lists(), filters] as const,
  details: () => [...wantedListKeys.all, 'detail'] as const,
  detail: (slug: string) => [...wantedListKeys.details(), slug] as const,
};

export const wantedListQueries = {
  getPublicWantedLists: (filters?: WantedListFilters) => {
    return wantedListApi.getPublicWantedLists(filters);
  },

  getPublicWantedDetail: (slug: string) => {
    return wantedListApi.getPublicWantedDetail(slug);
  },
};

