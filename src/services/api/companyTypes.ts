/**
 * Company Types API Endpoints
 *
 * Company type-related API operations.
 */

import { api } from './client';
import type { CompanyTypeResponse } from '@/types';

// ============================================================================
// COMPANY TYPES API FUNCTIONS
// ============================================================================

export const companyTypesApi = {
  /**
   * Get all company types
   */
  getCompanyTypes: () => {
    return api.get<CompanyTypeResponse>('/api/v1/company-types');
  },
};
