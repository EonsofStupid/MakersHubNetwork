import { StateCreator } from "zustand";
import { AuthState, AuthActions, AuthStore, AuthStatus } from "../types/auth.types";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";

export const createAuthSlice: StateCreator<
  AuthStore,
  [],
  [],
  AuthStore
> = (set, get) => ({
  user: null,
  session: null,
  roles: [],
  status: 'idle' as AuthStatus,
  error: null,
  initialized: false,
  isLoading: false,

  setUser: (user) => set({ user }),
  setSession: (session) => {
    // Update both session and user atomically
    set({ 
      session,
      user: session?.user ?? null,
      status: session ? 'authenticated' : 'unauthenticated'
    });
  },
  setRoles: (roles) => set({ roles }),
  setError: (error) => set({ error }),
  setStatus: (status) => set({ status }),
  setInitialized: (initialized) => set({ initialized }),
  setLoading: (isLoading) => set({ isLoading }),
  
  hasRole: (role) => get().roles.includes(role),
  isAdmin: () => get().roles.includes('admin'),

  initialize: async () => {
    try {
      set({ status: 'loading', isLoading: true, error: null });
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      if (session) {
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);
        
        if (rolesError) throw rolesError;

        set({
          user: session.user,
          session,
          roles: roles?.map(r => r.role) || [],
          status: 'authenticated',
          error: null
        });
      } else {
        set({ 
          user: null,
          session: null,
          roles: [],
          status: 'unauthenticated',
          error: null
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ 
        error: error instanceof AuthError ? error.message : 'An error occurred during initialization',
        status: 'unauthenticated',
        user: null,
        session: null,
        roles: []
      });
    } finally {
      set({ isLoading: false, initialized: true });
    }
  },

  clearState: () => {
    set({
      user: null,
      session: null,
      roles: [],
      error: null,
      status: 'idle',
      initialized: true,
      isLoading: false,
    });
  },

  logout: async () => {
    try {
      set({ status: 'loading', isLoading: true, error: null });
      await supabase.auth.signOut();
      get().clearState();
    } catch (error) {
      console.error('Logout error:', error);
      set({ 
        error: error instanceof AuthError ? error.message : 'An error occurred during logout',
        status: 'unauthenticated'
      });
    } finally {
      set({ isLoading: false });
    }
  },
});