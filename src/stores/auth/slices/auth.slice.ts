// src/stores/auth/slices/auth.slice.ts

import { StateCreator } from "zustand";
import { AuthState, AuthActions, AuthStore, AuthStatus } from "../types/auth.types";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";
import { AuthStateSchema } from "../schemas/state.schema";

export const createAuthSlice: StateCreator<AuthStore> = (set, get) => {
  // Validate initial state with Zod schema
  const initialState = AuthStateSchema.parse({
    user: null,
    session: null,
    roles: [],
    status: "idle",
    error: null,
    initialized: false,
    isLoading: false, // <-- added isLoading
  });

  return {
    ...initialState,

    // State setters
    setUser: (user) => set({ user }),
    setSession: (session) => set({ session }),
    setRoles: (roles) => set({ roles }),
    setError: (error) => set({ error }),
    setStatus: (status) => set({ status }),
    setInitialized: (initialized) => set({ initialized }),

    // The new setLoading action
    setLoading: (isLoading) => set({ isLoading }),

    // Example actions
    initialize: async () => {
      try {
        // Mark loading
        set({ status: "loading", isLoading: true });

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session) {
          // fetch roles, etc.
          set({
            user: session.user,
            session,
            // ...
            status: "authenticated",
          });
        } else {
          set({ status: "unauthenticated" });
        }
      } catch (error) {
        set({
          error: error instanceof AuthError
            ? error.message
            : "Error during initialization",
          status: "unauthenticated",
        });
      } finally {
        set({ initialized: true, isLoading: false });
      }
    },

    login: async (email: string, password: string) => {
      try {
        // reset error, mark loading
        set({ error: null, status: "loading", isLoading: true });

        // signIn logic
        // ...
        set({
          user, // from supabase result
          session, // from supabase result
          roles: roles?.map(r => r.role) || [],
          status: "authenticated",
          error: null,
        });
      } catch (error) {
        set({
          error: error instanceof AuthError
            ? error.message
            : "Error during login",
          status: "unauthenticated",
        });
      } finally {
        set({ isLoading: false });
      }
    },

    logout: async () => {
      try {
        set({ status: "loading", isLoading: true });
        await supabase.auth.signOut();

        // Clear everything
        get().clearState();
      } catch (error) {
        set({
          error: error instanceof AuthError
            ? error.message
            : "Error during logout",
          status: "unauthenticated",
        });
      } finally {
        set({ isLoading: false });
      }
    },

    clearState: () => {
      const clearedState = AuthStateSchema.parse({
        user: null,
        session: null,
        roles: [],
        error: null,
        status: "idle",
        initialized: true,
        isLoading: false,
      });
      set(clearedState);
    },
  };
};
