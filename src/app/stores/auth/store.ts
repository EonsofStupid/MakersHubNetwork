import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/app/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  error: Error | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  role: 'super_admin' | 'admin' | 'maker' | 'builder' | null;
  
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: true,
      error: null,
      isAdmin: false,
      isSuperAdmin: false,
      role: null,

      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          set({
            user: data.user,
            session: data.session,
            isAdmin: data.user?.user_metadata?.role === 'admin' || data.user?.user_metadata?.role === 'super_admin',
            isSuperAdmin: data.user?.user_metadata?.role === 'super_admin',
            role: data.user?.user_metadata?.role || null,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error : new Error('Failed to sign in'),
            isLoading: false,
          });
        }
      },

      signUp: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) throw error;

          set({
            user: data.user,
            session: data.session,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error : new Error('Failed to sign up'),
            isLoading: false,
          });
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.signOut();
          if (error) throw error;

          set({
            user: null,
            session: null,
            isAdmin: false,
            isSuperAdmin: false,
            role: null,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error : new Error('Failed to sign out'),
            isLoading: false,
          });
        }
      },

      resetPassword: async (email: string) => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.resetPasswordForEmail(email);
          if (error) throw error;
          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error : new Error('Failed to reset password'),
            isLoading: false,
          });
        }
      },

      updateProfile: async (data: Partial<User>) => {
        try {
          set({ isLoading: true, error: null });
          const { data: userData, error } = await supabase.auth.updateUser(data);
          if (error) throw error;

          set({
            user: userData.user,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error : new Error('Failed to update profile'),
            isLoading: false,
          });
        }
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true, error: null });
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;

          if (session) {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;

            set({
              user,
              session,
              isAdmin: user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'super_admin',
              isSuperAdmin: user?.user_metadata?.role === 'super_admin',
              role: user?.user_metadata?.role || null,
            });
          }

          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error : new Error('Failed to check auth status'),
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAdmin: state.isAdmin,
        isSuperAdmin: state.isSuperAdmin,
        role: state.role,
      }),
    }
  )
); 