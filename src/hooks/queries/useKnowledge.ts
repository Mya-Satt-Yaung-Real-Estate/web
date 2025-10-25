/**
 * Knowledge Hub Query Hooks
 * 
 * TanStack Query hooks for knowledge hub operations.
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { knowledgeQueries } from '../../services/queries/knowledge';
import type { KnowledgeHubFilters } from '@/types/knowledge';

// ============================================================================
// KNOWLEDGE HUB QUERIES
// ============================================================================

/**
 * Get knowledge hub articles with filters
 */
export function useKnowledgeHubs(filters: KnowledgeHubFilters = {}) {
  return useQuery(knowledgeQueries.getKnowledgeHubs(filters));
}

/**
 * Get a single knowledge hub article by slug
 */
export function useKnowledgeHub(slug: string) {
  return useQuery(knowledgeQueries.getKnowledgeHubBySlug(slug));
}

/**
 * Get knowledge hub categories
 */
export function useKnowledgeCategories() {
  return useQuery(knowledgeQueries.getKnowledgeCategories());
}

/**
 * Get popular knowledge hub articles
 */
export function usePopularKnowledgeHubs(limit: number = 5) {
  return useQuery(knowledgeQueries.getPopularKnowledgeHubs(limit));
}

/**
 * Get recent knowledge hub articles
 */
export function useRecentKnowledgeHubs(limit: number = 5) {
  return useQuery(knowledgeQueries.getRecentKnowledgeHubs(limit));
}

/**
 * Get infinite knowledge hub articles with pagination
 */
export function useInfiniteKnowledgeHubs(filters: KnowledgeHubFilters = {}) {
  return useInfiniteQuery({
    queryKey: knowledgeQueries.getKnowledgeHubs(filters).queryKey,
    queryFn: ({ pageParam = 1 }) => 
      knowledgeQueries.getKnowledgeHubs({ ...filters, page: pageParam }).queryFn(),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.has_more_pages ? pagination.current_page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
