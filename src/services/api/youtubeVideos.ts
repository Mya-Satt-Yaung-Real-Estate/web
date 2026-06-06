import { apiClient } from './client';
import type {
  YoutubeVideoDetailResponse,
  YoutubeVideoFilters,
  YoutubeVideoListResponse,
} from '@/types/youtubeVideo';

export const youtubeVideosApi = {
  async getYoutubeVideos(filters: YoutubeVideoFilters = {}): Promise<YoutubeVideoListResponse> {
    const response = await apiClient.get<YoutubeVideoListResponse>('/api/v1/frontend/youtube-videos', {
      params: filters,
    });
    return response.data;
  },

  async getYoutubeVideo(slug: string): Promise<YoutubeVideoDetailResponse> {
    const response = await apiClient.get<YoutubeVideoDetailResponse>(`/api/v1/frontend/youtube-videos/${slug}`);
    return response.data;
  },
};
