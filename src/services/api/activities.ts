import { api } from './client';
import type {
  ActivityCreateData,
  ActivityDetailResponse,
  ActivityListResponse,
  ActivityOwnerFilters,
  ActivityUpdateData,
} from '@/types/activity';

const BASE = '/api/v2/frontend/my-activities';
const PUBLIC_BASE = '/api/v2/frontend/public/activities';

export const activityApi = {
  getPublicDetail: (slug: string) => {
    return api.get<ActivityDetailResponse>(`${PUBLIC_BASE}/${slug}`);
  },

  getOwnerListings: (filters: ActivityOwnerFilters = {}) => {
    return api.get<ActivityListResponse>(BASE, { params: filters });
  },

  getOwnerDetail: (slug: string) => {
    return api.get<ActivityDetailResponse>(`${BASE}/${slug}`);
  },

  create: (data: ActivityCreateData) => {
    return api.post<ActivityDetailResponse>(BASE, data);
  },

  update: (slug: string, data: ActivityUpdateData) => {
    return api.put<ActivityDetailResponse>(`${BASE}/${slug}`, data);
  },

  remove: (slug: string) => {
    return api.delete<{ success: boolean; message: string }>(`${BASE}/${slug}`);
  },
};
