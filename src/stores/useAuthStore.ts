import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  checkAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const user = await res.json();
        set({ user, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error) {
      set({ 
        user: null, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to check authentication'
      });
    }
  },
  
  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        set({ user: null, isLoading: false });
        window.location.href = '/login';
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to logout'
      });
    }
  },
})); 