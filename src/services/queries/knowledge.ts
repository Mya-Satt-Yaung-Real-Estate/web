/**
 * Knowledge Hub Query Keys and Functions
 * 
 * TanStack Query definitions for knowledge hub operations.
 */

import { knowledgeApi } from '../api/knowledge';
import type { KnowledgeHubFilters } from '@/types/knowledge';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const knowledgeKeys = {
  all: ['knowledge'] as const,
  lists: () => [...knowledgeKeys.all, 'list'] as const,
  list: (filters: KnowledgeHubFilters) => [...knowledgeKeys.lists(), filters] as const,
  details: () => [...knowledgeKeys.all, 'detail'] as const,
  detail: (slug: string) => [...knowledgeKeys.details(), slug] as const,
  categories: () => [...knowledgeKeys.all, 'categories'] as const,
  popular: (limit: number) => [...knowledgeKeys.all, 'popular', limit] as const,
  recent: (limit: number) => [...knowledgeKeys.all, 'recent', limit] as const,
};

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

export const knowledgeQueries = {
  /**
   * Get knowledge hub articles with filters
   */
  getKnowledgeHubs: (filters: KnowledgeHubFilters = {}) => ({
    queryKey: knowledgeKeys.list(filters),
    queryFn: () => knowledgeApi.getKnowledgeHubs(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  }),

  /**
   * Get a single knowledge hub article by slug
   */
  getKnowledgeHubBySlug: (slug: string) => ({
    queryKey: knowledgeKeys.detail(slug),
    queryFn: () => knowledgeApi.getKnowledgeHubBySlug(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  }),

  /**
   * Get knowledge hub categories
   */
  getKnowledgeCategories: () => ({
    queryKey: knowledgeKeys.categories(),
    queryFn: () => knowledgeApi.getKnowledgeCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  }),

  /**
   * Get popular knowledge hub articles
   */
  getPopularKnowledgeHubs: (limit: number = 5) => ({
    queryKey: knowledgeKeys.popular(limit),
    queryFn: () => knowledgeApi.getPopularKnowledgeHubs(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  }),

  /**
   * Get recent knowledge hub articles
   */
  getRecentKnowledgeHubs: (limit: number = 5) => ({
    queryKey: knowledgeKeys.recent(limit),
    queryFn: () => knowledgeApi.getRecentKnowledgeHubs(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  }),
};



