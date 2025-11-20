/**
 * Point System Types
 * 
 * TypeScript types for point management system.
 */

// ============================================================================
// POINT PACKAGE TYPES
// ============================================================================

export interface PointPackage {
  id: number;
  name_en: string;
  name_mm: string;
  slug: string;
  points: number;
  price_mmk: number;
  formatted_price: string;
  description_en?: string;
  description_mm?: string;
}

// ============================================================================
// POINT BALANCE TYPES
// ============================================================================

export interface PointBalance {
  current_balance: number;
  total_allocated: number;
  total_consumed: number;
  pending_requests: number;
}

// ============================================================================
// POINT ALLOCATION TYPES (FIFO)
// ============================================================================

export interface PointAllocation {
  id: number;
  points_allocated: number;
  points_remaining: number;
  points_consumed: number;
  consumption_percentage: number;
  allocated_at: string;
  expires_at: string | null;
  days_until_expiry: number | null;
  is_expired: boolean;
  is_active: boolean;
  has_balance: boolean;
  notes?: string | null;
  package: PointPackage | null;
  allocated_by?: {
    id: number;
    name: string;
  } | null;
  formatted_allocated_at: string | null;
  formatted_expires_at: string | null;
  status: 'active' | 'partially_consumed' | 'consumed' | 'expired';
  status_label: string;
  created_at: string;
  updated_at: string;
}

export interface PointFifoSummary {
  total_allocated: number;
  total_remaining: number;
  total_consumed: number;
  expired_points: number;
  fully_consumed_allocations: number;
  active_allocations_count: number;
}

export interface PointFifoResponse {
  current_balance: number;
  summary: PointFifoSummary;
  allocations: PointAllocation[];
}

// ============================================================================
// POINT TRANSACTION TYPES
// ============================================================================

export interface PointTransaction {
  id: number;
  transaction_type: 'CREDIT' | 'DEBIT';
  points_amount: number;
  formatted_points_amount: string;
  reference_type: string;
  reference_id: number | null;
  formatted_created_at: string;
  balance_before: number;
  balance_after: number;
  description: string;
}

// ============================================================================
// POINT PURCHASE REQUEST TYPES
// ============================================================================

export interface PointPurchaseRequest {
  id: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  status_label: string;
  payment_method: string;
  formatted_payment_method: string;
  payment_reference: string | null;
  payment_date: string | null;
  requested_at: string;
  approved_at: string | null;
  package: PointPackage;
  points_requested: number;
  price_mmk: number;
  formatted_price: string;
  can_update: boolean;
  can_cancel: boolean;
  is_pending: boolean;
  is_approved: boolean;
  is_rejected: boolean;
  is_cancelled: boolean;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface PointPackagesResponse {
  success: boolean;
  message: string;
  data: {
    package_list: PointPackage[];
    balance: PointBalance;
    recent_transactions: PointTransaction[];
  };
}

export interface PointFifoApiResponse {
  success: boolean;
  message: string;
  data: PointFifoResponse;
}

export interface PointTransactionsResponse {
  success: boolean;
  message: string;
  data: PointTransaction[];
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
    has_more_pages: boolean;
  };
}

export interface PointPurchaseResponse {
  success: boolean;
  message: string;
  data: PointPurchaseRequest;
}

