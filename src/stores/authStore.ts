import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/services/api/auth';
import type { User } from '@/types/auth';

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  updateUser: (updates: Partial<User>) => void;
  signOut: () => void;
  signInAsGuest: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user && user.user_id !== 0 
      }),

      setToken: (token) => set({ token }),

      setLoading: (isLoading) => set({ isLoading }),

      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),

      signOut: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          // Even if logout API fails, clear local state
        } finally {
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false 
          });
        }
      },

      signInAsGuest: () => {
        set({
          user: {
            user_id: 0,
            name: 'Guest',
            email: '',
            phone: '',
            user_type: 'individual',
            member_level: 'bronze',
            verify_account: false,
            member_since: new Date().toISOString(),
            profile_image_url: '',
            current_point: 0,
            account_statistics: {
              total_property_count: 0,
              sold_property_count: 0,
            },
            achievements: {
              verify_account: false,
              top_seller: 0,
              fast_responder: 0,
              trusted_agent: false,
            },
            my_property_listing: {
              total_property_count: 0,
              sold_property_count: 0,
            },
            // Backward compatibility
            id: 0,
            is_active: false,
            last_login_at: new Date().toISOString(),
            point_balance: 0,
            total_points_allocated: 0,
            total_points_consumed: 0,
            isGuest: true,
            points: 0,
          },
          token: null,
          isAuthenticated: false,
          isLoading: false
        });
      },

      checkAuth: async () => {
        const { token } = get();
        
        if (!token) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }
        
        try {
          set({ isLoading: true });
          const apiResponse = await authApi.getProfile();
          
          // Extract user data from API response
          // The API returns { success, message, data: { user_data } }
          const userData = (apiResponse as any).data || apiResponse;
          
          // Preload profile image for better performance
          if (userData.profile_image_url) {
            const img = new Image();
            img.src = userData.profile_image_url;
          }
          
          // Add backward compatibility fields
          const userWithCompatibility = {
            ...userData,
            id: userData.user_id,
            is_active: userData.verify_account,
            point_balance: userData.current_point,
            points: userData.current_point,
            last_login_at: new Date().toISOString(), // Default value since not in API
            total_points_allocated: 0, // Default value since not in API
            total_points_consumed: 0, // Default value since not in API
          };
          
          set({ 
            user: userWithCompatibility, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          // User is not authenticated or token is invalid
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }), // Only persist token
    }
  )
);

// Initialize auth check on store creation
useAuthStore.getState().checkAuth();
