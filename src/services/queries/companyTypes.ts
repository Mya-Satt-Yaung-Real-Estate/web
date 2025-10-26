/**
 * Company Types Query Definitions
 *
 * TanStack Query definitions for company type-related data.
 */

import { companyTypesApi } from '../api/companyTypes';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const companyTypeKeys = {
  all: ['companyTypes'] as const,
  lists: () => [...companyTypeKeys.all, 'list'] as const,
  list: () => [...companyTypeKeys.lists()] as const,
} as const;

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

export const companyTypeQueries = {
  /**
   * Get all company types
   */
  getCompanyTypes: () => {
    return companyTypesApi.getCompanyTypes();
  },
};
