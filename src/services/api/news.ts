import { apiClient } from './client';
import type { NewsResponse, NewsFilters, NewsCategoryResponse, NewsDetailResponse } from '@/types/news';

export const newsApi = {
  async getNewsAndUpdates(filters: NewsFilters = {}): Promise<NewsResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('news_article_category_id', filters.category.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());
    if (filters.page) params.append('page', filters.page.toString());

    const response = await apiClient.get<NewsResponse>(`/api/v1/frontend/news-and-updates?${params.toString()}`);
    return response.data;
  },

  async getNewsCategories(): Promise<NewsCategoryResponse> {
    const response = await apiClient.get<NewsCategoryResponse>('/api/v1/news-article-categories?type=news_update');
    return response.data;
  },

  async getNewsDetail(slug: string): Promise<NewsDetailResponse> {
    const response = await apiClient.get<NewsDetailResponse>(`/api/v1/frontend/news-and-updates/${slug}`);
    return response.data;
  },
};
