import { api } from './client';
import type { PublicPropertyListResponse, PublicPropertyFilters, PublicPropertyDetailResponse } from '@/types/publicProperties';

export const publicPropertyApi = {

  getPublicProperties: (filters: PublicPropertyFilters = {}) => {
    return api.get<PublicPropertyListResponse>('/api/v1/frontend/public/properties', {
      params: filters,
    });
  },

  getPremiumProperties: (filters: Omit<PublicPropertyFilters, 'premium'> = {}) => {
    return api.get<PublicPropertyListResponse>('/api/v1/frontend/public/properties', {
      params: {
        ...filters,
        premium: true,
      },
    });
  },

  getJadeMarketplaceProperties: (filters: Omit<PublicPropertyFilters, 'jade_market'> = {}) => {
    return api.get<PublicPropertyListResponse>('/api/v1/frontend/public/properties', {
      params: {
        ...filters,
        jade_market: true,
      },
    });
  },

  getTanTanTanProperties: (filters: Omit<PublicPropertyFilters, 'tan_tan_tan'> = {}) => {
    return api.get<PublicPropertyListResponse>('/api/v1/frontend/public/properties', {
      params: {
        ...filters,
        tan_tan_tan: true,
      },
    });
  },

  getInstallmentProperties: (filters: Omit<PublicPropertyFilters, 'installment'> = {}) => {
    return api.get<PublicPropertyListResponse>('/api/v1/frontend/public/properties', {
      params: {
        ...filters,
        installment: true,
      },
    });
  },

  getPropertiesByListingType: (
    listingTypeId: number,
    filters: Omit<PublicPropertyFilters, 'listing_type_id'> = {}
  ) => {
    return api.get<PublicPropertyListResponse>('/api/v1/frontend/public/properties', {
      params: {
        ...filters,
        listing_type_id: listingTypeId,
      },
    });
  },

  getPublicPropertyBySlug: (slug: string) => {
    return api.get<PublicPropertyDetailResponse>(`/api/v1/frontend/public/properties/${slug}`);
  },

  /**
   * Get related properties for a property (frontend endpoint)
   */
  getRelatedProperties: (slug: string) => {
    return api.get<PublicPropertyListResponse>(`/api/v1/frontend/public/properties/${slug}/related`);
  },

  /**
   * Toggle favorite status for a public property (frontend endpoint)
   */
  toggleFavorite: (slug: string) => {
    return api.post<{ success: boolean; message: string; data: { is_favorited: boolean; favorite_count?: number } }>(`/api/v1/frontend/properties/${slug}/favorite`);
  },

  /**
   * Toggle like status for a public property (frontend endpoint)
   */
  toggleLike: (slug: string) => {
    return api.post<{ success: boolean; message: string; data: { liked: boolean; like_count?: number } }>(`/api/v1/frontend/properties/${slug}/like`);
  },

  /**
   * Add a comment to a property (frontend endpoint)
   */
  addComment: (slug: string, comment: string) => {
    return api.post<{ 
      success: boolean; 
      message: string; 
      data: { 
        id: number; 
        parent_id: number | null; 
        comment: string; 
        user: { 
          id: number; 
          name: string; 
          slug: string; 
        }; 
      } 
    }>(`/api/v1/frontend/property-comments/${slug}`, { comment });
  },

  /**
   * Update a comment (frontend endpoint)
   */
  updateComment: (slug: string, commentId: number, comment: string) => {
    return api.put<{ 
      success: boolean; 
      message: string; 
      data: {
        id: number;
        user_id: number;
        property_id: number;
        parent_id: number | null;
        comment: string;
        created_at: string;
        updated_at: string;
        user: {
          id: number;
          name: string;
          slug: string;
        };
      };
    }>(`/api/v1/frontend/property-comments/${slug}/comment/${commentId}`, { comment });
  },

  /**
   * Delete a comment (frontend endpoint)
   */
  deleteComment: (slug: string, commentId: number) => {
    return api.delete<{ 
      success: boolean; 
      message: string; 
    }>(`/api/v1/frontend/property-comments/${slug}/comment/${commentId}`);
  },

  /**
   * Reply to a comment (frontend endpoint)
   */
  replyToComment: (slug: string, commentId: number, comment: string) => {
    return api.post<{ 
      success: boolean; 
      message: string; 
      data: { 
        id: number; 
        parent_id: number; 
        comment: string; 
        user: { 
          id: number; 
          name: string; 
          slug: string; 
        }; 
      } 
    }>(`/api/v1/frontend/property-comments/${slug}/reply/${commentId}`, { comment });
  },
};


