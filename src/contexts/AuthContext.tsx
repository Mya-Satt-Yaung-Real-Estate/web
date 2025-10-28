import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/services/api/auth';
import type { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  signInAsGuest: () => void;
  signOut: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app load
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const userData = await authApi.getProfile();
      setUser(userData);
    } catch (error) {
      // User is not authenticated or token is invalid
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const signInAsGuest = () => {
    setUser({
      id: 0,
      name: 'Guest',
      email: '',
      phone: '',
      user_type: 'individual',
      member_level: 'bronze',
      is_active: false,
      member_since: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
      profile_image_url: '',
      point_balance: 0,
      total_points_allocated: 0,
      total_points_consumed: 0,
      isGuest: true,
      points: 0,
    });
  };

  const signOut = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Even if logout API fails, clear local state
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signInAsGuest,
        signOut,
        isAuthenticated: !!user && user.id !== 0,
        isLoading,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}