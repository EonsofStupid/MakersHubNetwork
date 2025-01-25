import { StateCreator } from "zustand";
import { AuthState, AuthActions, AuthStore, AuthStatus } from "../types/auth.types";
import { supabase } from "@/integrations/supabase/client";
import { AuthError, Subscription } from "@supabase/supabase-js";

export const createAuthSlice: StateCreator<AuthStore, [], [], AuthStore> = (set, get) => {
  // Just store the subscription object itself:
  let authSubscription: Subscription | null = null;

  async function fetchSessionAndRoles(sessionParam?: any) {
    // ... your existing fetch logic ...
  }

  function subscribeAuthStateChange() {
    if (authSubscription) {
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // ...
      }
    );

    authSubscription = subscription;
  }

  return {
    // ...rest of your store state and actions...

    initialize: async () => {
      if (get().initialized) return;

      set({ status: "loading", isLoading: true, error: null });
      try {
        await fetchSessionAndRoles();
        subscribeAuthStateChange();
      } catch (error) {
        console.error("Auth initialization error:", error);
        set({
          error:
            error instanceof AuthError
              ? error.message
              : "An error occurred during initialization",
          status: "unauthenticated",
        });
      } finally {
        set({ isLoading: false, initialized: true });
      }
    },

    // ...
  };
};
