import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createUser, authenticateUser } from '@/lib/auth';
import { PublicUser } from '@/lib/schema';

interface AuthState {
  user: PublicUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: PublicUser | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),

      setLoading: (isLoading) => set({ isLoading }),

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const user = await authenticateUser(email, password);
          
          if (!user) {
            throw new Error('Invalid credentials');
          }
          
          set({ 
            user, 
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        // TODO: Implement actual logout logic
        // await supabase.auth.signOut();
        set({ 
          user: null, 
          isAuthenticated: false,
          isLoading: false 
        });
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          const user = await createUser(email, password, name);
          
          set({ 
            user, 
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error) {
          console.error('Registration error:', error);
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
); 