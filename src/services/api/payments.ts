/**
 * Payment API Endpoints
 * 
 * Payment-related API operations.
 */

import { api } from './client';
import type {
  PaymentTokenRequest,
  PaymentTokenResponse,
  PointOrderResponse,
} from '@/types/payments';

// ============================================================================
// PAYMENT API FUNCTIONS
// ============================================================================

export const paymentApi = {
  /**
   * Get payment token from Dinger
   */
  getPaymentToken: (payload: PaymentTokenRequest) => {
    return api.post<PaymentTokenResponse>('/api/v2/frontend/dinger/get-payment-token', payload);
  },

  /**
   * Get point order status (alias for getPointOrderDetail)
   */
  getPointOrderStatus: (orderId: string) => {
    return api.get<PointOrderResponse>(`/api/v2/frontend/point-orders/${orderId}`);
  },

  /**
   * Get point order detail by order ID
   */
  getPointOrderDetail: (orderId: string) => {
    return api.get<PointOrderResponse>(`/api/v2/frontend/point-orders/${orderId}`);
  },
};


