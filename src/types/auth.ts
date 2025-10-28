// Login API Types
export interface LoginRequest {
  type: 'email' | 'phone';
  email?: string;
  phone?: string;
  password: string;
  device_token?: string;
}

export interface User {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  user_type: string;
  member_level: string;
  verify_account: boolean;
  member_since: string;
  profile_image_url: string;
  current_point: number;
  account_statistics: {
    total_property_count: number;
    sold_property_count: number;
  };
  achievements: {
    verify_account: boolean;
    top_seller: number;
    fast_responder: number;
    trusted_agent: boolean;
  };
  my_property_listing: {
    total_property_count: number;
    sold_property_count: number;
  };
  // Backward compatibility fields
  id?: number; // Alias for user_id
  is_active?: boolean; // Derived from verify_account
  last_login_at?: string; // Not in API response
  point_balance?: number; // Alias for current_point
  total_points_allocated?: number; // Not in API response
  total_points_consumed?: number; // Not in API response
  isGuest?: boolean; // Optional for guest users
  points?: number; // Alias for current_point for backward compatibility
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    token_type: string;
    login_method: string;
    biometric_enabled: boolean;
  };
}
