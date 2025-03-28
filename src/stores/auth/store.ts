
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  roles: string[];
}

interface AuthState {
  isLoggedIn: boolean;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  status: 'loading',
  user: null,
  login: async (email, password) => {
    // Simulate login - replace with actual implementation
    set({ 
      isLoggedIn: true, 
      status: 'authenticated',
      user: {
        id: '123',
        email,
        roles: ['user']
      }
    });
  },
  logout: () => {
    // Clear auth state
    set({ 
      isLoggedIn: false, 
      status: 'unauthenticated',
      user: null
    });
  }
}));
