import { StateCreator } from "zustand";
import { AuthState, AuthActions, AuthStore } from "../types/auth.types";
import { supabase } from "@/integrations/supabase/client";

export const createAuthSlice: StateCreator<
  AuthStore,
  [],
  [],
  AuthStore
> = (set, get, _store) => ({
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
  hasRole: (role) => get().roles.includes(role),
  isAdmin: () => get().roles.includes('admin'),
  clearState: () => {
    set({
      user: null,
      session: null,
      roles: [],
      error: null,
      isLoading: false,
      initialized: true,
    });
  },
  logout: async () => {
    try {
      await supabase.auth.signOut();
      get().clearState();
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
});