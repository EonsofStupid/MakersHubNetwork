import { StateCreator } from "zustand";
import { AuthState, AuthActions, AuthStore, AuthStatus } from "../types/auth.types";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { AuthStateSchema } from "../schemas/state.schema";

export const createAuthSlice: StateCreator<
  AuthStore,
  [],
  [],
  AuthStore
> = (set, get) => {
  // Validate initial state with Zod schema
  const initialState: AuthStore = {
    user: null,
    session: null,
    roles: [],
    status: 'idle' as AuthStatus,
    error: null,
    initialized: false,
    isLoading: false,
    setUser: (user) => set({ user }),
    setSession: (session) => set({ session }),
    setRoles: (roles) => set({ roles }),
    setError: (error) => set({ error }),
    setStatus: (status) => set({ status }),
    setInitialized: (initialized) => set({ initialized }),
    setLoading: (isLoading) => set({ isLoading }),
    hasRole: (role) => get().roles.includes(role),
    isAdmin: () => get().roles.includes('admin'),
    initialize: async () => {
      try {
        set({ status: 'loading', isLoading: true });
        
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
          });
        } else {
          set({ status: 'unauthenticated' });
        }
      } catch (error) {
        set({ 
          error: error instanceof AuthError ? error.message : 'An error occurred during initialization',
          status: 'unauthenticated'
        });
      } finally {
        set({ isLoading: false, initialized: true });
      }
    },
    login: async (email: string, password: string) => {
      try {
        set({ status: 'loading', isLoading: true, error: null });
        
        const { data: { session, user }, error: authError } = 
          await supabase.auth.signInWithPassword({ email, password });
        
        if (authError) throw authError;
        if (!session || !user) throw new Error('No session or user returned');

        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
        
        if (rolesError) throw rolesError;

        set({
          user,
          session,
          roles: roles?.map(r => r.role) || [],
          status: 'authenticated',
          error: null
        });
      } catch (error) {
        set({ 
          error: error instanceof AuthError ? error.message : 'An error occurred during login',
          status: 'unauthenticated'
        });
      } finally {
        set({ isLoading: false });
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
        set({ status: 'loading', isLoading: true });
        await supabase.auth.signOut();
        get().clearState();
      } catch (error) {
        set({ 
          error: error instanceof AuthError ? error.message : 'An error occurred during logout',
          status: 'unauthenticated'
        });
      } finally {
        set({ isLoading: false });
      }
    },
  };

  return initialState;
};