/**
 * Payment System Types
 * 
 * TypeScript types for payment integration system.
 */

// ============================================================================
// PAYMENT TOKEN TYPES
// ============================================================================

export interface PaymentTokenRequest {
  providerName: string;
  methodName: string;
  packageId: number;
}

export interface PaymentTokenResponseInner {
  amount: number;
  merchOrderId: string;
  transactionNum: string;
  qrCode?: string;
  sign: string;
  signType: string;
}

export interface PaymentTokenResponseData {
  code: string;
  message: string;
  time: string;
  response: PaymentTokenResponseInner;
}

export interface PaymentTokenResponse {
  status: 'success' | 'error';
  message: string;
  response: PaymentTokenResponseData;
}

// ============================================================================
// POINT ORDER TYPES
// ============================================================================

export interface PointOrder {
  id: number;
  user_id: number;
  package_id: number;
  point_amount: number;
  price_mmk: number;
  order_id: string;
  payment_status: 'SUCCESS' | 'ERROR' | 'CANCELLED' | 'TIMEOUT' | 'DECLINED' | 'SYSTEM_ERROR';
  payment_provider: string;
  dinger_transaction_id: string | null;
  dinger_provider_name: string | null;
  dinger_method_name: string | null;
  status: 'pending' | 'approved' | 'failed' | 'cancelled';
  payment_completed_at: string | null;
  payment_failed_at: string | null;
  payment_failure_reason: string | null;
  points_allocated_at: string | null;
  allocated_by: number | null;
  created_at: string;
  updated_at: string;
  package?: {
    id: number;
    name_en: string;
    name_mm: string;
    points: number;
    price_mmk: number;
  };
}

export interface PointOrderResponse {
  success: boolean;
  message: string;
  data: PointOrder;
}

// ============================================================================
// PAYMENT PROVIDER TYPES
// ============================================================================

export type PaymentProvider = 
  | 'AYA Pay'
  | 'KBZ Pay'
  | 'Wave Pay'
  | 'OK$'
  | 'Sai Sai Pay'
  | 'Onepay'
  | 'MPitesan'
  | 'MPT Pay'
  | 'CB Pay'
  | 'UAB Pay';

export type PaymentMethod = 'QR' | 'PIN' | 'PWA';

export interface PaymentProviderConfig {
  name: PaymentProvider;
  methods: PaymentMethod[];
  icon?: string;
}

