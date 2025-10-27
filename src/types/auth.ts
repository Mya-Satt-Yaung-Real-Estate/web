// Login API Types
export interface LoginRequest {
  type: 'email' | 'phone';
  email?: string;
  phone?: string;
  password: string;
  device_token?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  user_type: string;
  member_level: string;
  is_active: boolean;
  member_since: string;
  last_login_at: string;
  profile_image_url: string;
  point_balance: number;
  total_points_allocated: number;
  total_points_consumed: number;
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
