/**
 * Payment Query Definitions
 * 
 * TanStack Query definitions for payment operations.
 */

import { paymentApi } from '../api/payments';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const paymentKeys = {
  all: ['payments'] as const,
  orderStatus: (orderId: string) => [...paymentKeys.all, 'order-status', orderId] as const,
} as const;

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

export const paymentQueries = {
  /**
   * Get point order status
   */
  getPointOrderStatus: (orderId: string) => {
    return paymentApi.getPointOrderStatus(orderId);
  },

  /**
   * Get point order detail (alias for getPointOrderStatus)
   */
  getPointOrderDetail: (orderId: string) => {
    return paymentApi.getPointOrderDetail(orderId);
  },
};


