// Common types used across the application

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'success' | 'error';
}

export interface NavigationItem {
  name: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface Theme {
  mode: 'light' | 'dark';
  primary: string;
  secondary: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}


