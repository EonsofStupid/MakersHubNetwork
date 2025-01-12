import { StateCreator } from "zustand";
import { AuthState, AuthActions } from "../types/auth.types";
import { supabase } from "@/integrations/supabase/client";

export const createAuthSlice: StateCreator<
  AuthState & AuthActions,
  [],
  [],
  AuthState & AuthActions
> = (set) => ({
  // Initial state
  user: null,
  session: null,
  roles: [],
  isLoading: true,
  error: null,
  initialized: false,

  // Actions
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setRoles: (roles) => set({ roles }),
  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (initialized) => set({ initialized }),
  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({
        user: null,
        session: null,
        roles: [],
        error: null,
        isLoading: false,
        initialized: true,
      });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
});