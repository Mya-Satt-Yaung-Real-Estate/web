import { housingEventApi } from '../api/housingEvents';
import type { HousingEventFilters } from '@/types/housingEvents';

export const housingEventKeys = {
  all: ['housing-events'] as const,
  lists: () => [...housingEventKeys.all, 'list'] as const,
  list: (filters?: HousingEventFilters) => [...housingEventKeys.lists(), filters] as const,
} as const;

export const housingEventQueries = {
  getHousingEvents: (filters?: HousingEventFilters) => {
    return housingEventApi.getHousingEvents(filters);
  },
};

