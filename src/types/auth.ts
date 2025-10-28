// Login API Types
export interface LoginRequest {
  type: 'email' | 'phone';
  email?: string;
  phone?: string;
  password: string;
  device_token?: string;
}

// Base user interface with common fields
interface BaseUser {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  user_type: 'individual' | 'company';
  member_level: string;
  verify_account: boolean;
  member_since: string;
  profile_image_url: string | null;
  current_point: number;
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
}

// Individual user specific fields
interface IndividualUser extends BaseUser {
  user_type: 'individual';
  account_statistics: {
    total_property_count: number;
    sold_property_count: number;
  };
}

// Company user specific fields
interface CompanyUser extends BaseUser {
  user_type: 'company';
  account_statistics: {
    view_count: number;
    contact_count: number;
    total_property_count: number;
    sold_property_count: number;
  };
  property_perference?: {
    location_en: string;
    location_mm: string;
  };
  personal_information?: {
    user_id: number;
    email: string;
    user_name: string;
    user_type: string;
    company_name: string;
    phone: string;
    description: string;
    member_since: string;
    location_en: string;
    location_mm: string;
    company_type_en: string;
    company_type_mm: string;
    business_address: string;
  };
}

// Union type for User
export type User = IndividualUser | CompanyUser;

// Extended User interface with backward compatibility fields
export interface ExtendedUser {
  // Common fields from BaseUser
  user_id: number;
  name: string;
  email: string;
  phone: string;
  user_type: 'individual' | 'company';
  member_level: string;
  verify_account: boolean;
  member_since: string;
  profile_image_url: string | null;
  current_point: number;
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
  
  // Individual user specific fields
  account_statistics: {
    total_property_count: number;
    sold_property_count: number;
    view_count?: number; // For company users
    contact_count?: number; // For company users
  };
  
  // Company user specific fields (optional)
  property_perference?: {
    location_en: string;
    location_mm: string;
  };
  personal_information?: {
    user_id: number;
    email: string;
    user_name: string;
    user_type: string;
    company_name: string;
    phone: string;
    description: string;
    member_since: string;
    location_en: string;
    location_mm: string;
    company_type_en: string;
    company_type_mm: string;
    business_address: string;
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
    user: ExtendedUser;
    token: string;
    token_type: string;
    login_method: string;
    biometric_enabled: boolean;
  };
}
