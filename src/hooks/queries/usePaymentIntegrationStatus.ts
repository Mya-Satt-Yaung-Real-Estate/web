/**
 * Payment Integration Status Hook
 * 
 * Hook to check if payment integration is enabled from point settings
 */

import { useQuery } from '@tanstack/react-query';
import { pointSettingsApi } from '@/services/api/pointSettings';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const paymentIntegrationStatusKeys = {
  all: ['payment-integration-status'] as const,
  status: () => [...paymentIntegrationStatusKeys.all, 'status'] as const,
} as const;

// ============================================================================
// QUERY HOOK
// ============================================================================

/**
 * Get payment integration status from point settings
 * 
 * @returns {Object} Query result with:
 *   - data: { isPaymentEnabled: boolean } | undefined
 *   - isLoading: boolean
 *   - error: Error | null
 */
export function usePaymentIntegrationStatus() {
  const query = useQuery({
    queryKey: paymentIntegrationStatusKeys.status(),
    queryFn: async () => {
      const response = await pointSettingsApi.getPointSettings();
      return {
        isPaymentEnabled: response.data?.data?.payment_integration_status === true,
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (config doesn't change often)
    retry: 2,
  });

  return {
    ...query,
    isPaymentEnabled: query.data?.isPaymentEnabled ?? false,
  };
}

