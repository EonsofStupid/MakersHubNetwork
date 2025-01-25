import { StateCreator } from "zustand";
import { AuthState, AuthActions, AuthStore, AuthStatus } from "../types/auth.types";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";

/**
 * createAuthSlice
 * 
 * This slice is your single source of truth for:
 *   1) Checking the initial session
 *   2) Subscribing to onAuthStateChange
 *   3) Logging in & out
 *   4) Fetching roles
 */
export const createAuthSlice: StateCreator<AuthStore, [], [], AuthStore> = (set, get) => {
  // We'll hold onto the subscription ref so we can avoid double-subscribing
  let authSubscription: ReturnType<typeof supabase.auth.onAuthStateChange> | null = null;

  /**
   * Helper to fetch the session & roles from Supabase (or from a given session)
   * and update the store state accordingly.
   */
  async function fetchSessionAndRoles(sessionParam?: any) {
    try {
      // If a session was passed in (e.g. from onAuthStateChange), use it; otherwise call getSession().
      const session =
        sessionParam ?? (await supabase.auth.getSession()).data.session;

      if (!session || !session.user) {
        // No session or no user means we’re unauthenticated
        set({
          user: null,
          session: null,
          roles: [],
          status: "unauthenticated",
          error: null,
        });
        return;
      }

      // Otherwise, fetch roles from the "user_roles" table
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      if (rolesError) {
        throw rolesError;
      }

      set({
        user: session.user,
        session,
        roles: userRoles?.map((r) => r.role) || [],
        status: "authenticated",
        error: null,
      });
    } catch (error) {
      console.error("fetchSessionAndRoles error:", error);
      set({
        user: null,
        session: null,
        roles: [],
        status: "unauthenticated",
        error:
          error instanceof AuthError
            ? error.message
            : "An error occurred while fetching session/roles",
      });
    }
  }

  /**
   * Subscribes exactly once to the onAuthStateChange event.
   * When Supabase says the user has signed in/out, we fetch or clear the session.
   */
  function subscribeAuthStateChange() {
    if (authSubscription) {
      // Already subscribed, do nothing
      return;
    }
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AUTH STATE CHANGED:", event, session?.user?.id);

      if (event === "SIGNED_IN" && session?.user) {
        // Re-fetch everything so we have roles, user, etc.
        await fetchSessionAndRoles(session);
      } else if (event === "SIGNED_OUT") {
        // Clear store when logged out
        get().clearState();
        set({ status: "unauthenticated" });
      }
    });

    authSubscription = subscription;
  }

  return {
    // ======== State ========
    user: null,
    session: null,
    roles: [],
    status: "idle" as AuthStatus,
    error: null,
    initialized: false,
    isLoading: false,

    // ======== Basic Setters ========
    setUser: (user) => set({ user }),
    setSession: (session) =>
      set({
        session,
        user: session?.user ?? null,
        status: session ? "authenticated" : "unauthenticated",
      }),
    setRoles: (roles) => set({ roles }),
    setError: (error) => set({ error }),
    setStatus: (status) => set({ status }),
    setInitialized: (initialized) => set({ initialized }),
    setLoading: (isLoading) => set({ isLoading }),

    // ======== Helpers / Getters ========
    hasRole: (role) => get().roles.includes(role),
    isAdmin: () => get().roles.includes("admin"),

    // ======== Thunks / Async Actions ========
    login: async (email: string, password: string) => {
      try {
        set({ status: "loading", isLoading: true, error: null });

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // Once logged in, fetch session & roles with the newly created session
        await fetchSessionAndRoles(data.session);
      } catch (error) {
        console.error("Login error:", error);
        set({
          error:
            error instanceof AuthError
              ? error.message
              : "An error occurred during login",
          status: "unauthenticated",
        });
      } finally {
        set({ isLoading: false });
      }
    },

    initialize: async () => {
      // If we've already initialized once, bail out
      if (get().initialized) return;

      set({ status: "loading", isLoading: true, error: null });
      try {
        // 1) fetch existing session & roles
        await fetchSessionAndRoles();

        // 2) subscribe to auth changes exactly once
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

    logout: async () => {
      try {
        set({ status: "loading", isLoading: true, error: null });
        await supabase.auth.signOut();
        // The onAuthStateChange callback will handle clearing local state.
      } catch (error) {
        console.error("Logout error:", error);
        set({
          error:
            error instanceof AuthError
              ? error.message
              : "An error occurred during logout",
          status: "unauthenticated",
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
        // We'll set status to 'idle' by default; 
        // If you prefer 'unauthenticated', do that instead:
        status: "idle",
        initialized: true,
        isLoading: false,
      });
    },
  };
};
