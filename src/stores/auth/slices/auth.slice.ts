import { StateCreator } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";
import { AuthState, AuthActions, AuthStore, AuthStatus } from "../types/auth.types";

/**
 * createAuthSlice
 * 
 * Contains all the logic for auth: 
 * - Checking session on init
 * - Subscribing to onAuthStateChange
 * - Login, logout, error handling
 */
export const createAuthSlice: StateCreator<AuthStore, [], [], AuthStore> = (set, get) => {
  // For cleaning up the subscription later if needed:
  let authSubscription: ReturnType<typeof supabase.auth.onAuthStateChange> | null = null;

  const handleAuthStateChange = async (event: string, session: any) => {
    console.log("Auth state changed:", event, session?.user?.id);

    if (event === "SIGNED_IN" && session?.user) {
      await get().fetchSessionAndRoles(session);
    } 
    else if (event === "SIGNED_OUT") {
      set({
        user: null,
        session: null,
        roles: [],
        status: "unauthenticated",
        error: null,
      });
    }
  };

  return {
    user: null,
    session: null,
    roles: [],
    status: "idle" as AuthStatus,
    error: null,
    initialized: false,
    isLoading: false,

    // ============ Actions ============

    setUser: (user) => set({ user }),
    setSession: (session) => {
      set({
        session,
        user: session?.user ?? null,
        status: session ? "authenticated" : "unauthenticated",
      });
    },
    setRoles: (roles) => set({ roles }),
    setError: (error) => set({ error }),
    setStatus: (status) => set({ status }),
    setInitialized: (initialized) => set({ initialized }),
    setLoading: (isLoading) => set({ isLoading }),

    hasRole: (role) => get().roles.includes(role),
    isAdmin: () => get().roles.includes("admin"),

    /**
     * fetchSessionAndRoles
     * 
     * Helper to set the session, user, and roles in store
     * from the given session object (or from supabase if not provided).
     */
    fetchSessionAndRoles: async (sessionParam) => {
      set({ isLoading: true, error: null });

      try {
        const session = sessionParam ?? (await supabase.auth.getSession()).data?.session;
        if (!session || !session.user) {
          set({
            user: null,
            session: null,
            roles: [],
            status: "unauthenticated",
            error: null,
          });
          return;
        }

        // If there is a user, fetch roles from user_roles
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
          error: error instanceof AuthError ? error.message : "An error occurred",
        });
      } finally {
        set({ isLoading: false });
      }
    },

    /**
     * initialize
     * 
     * Called once to:
     * 1. Check existing session
     * 2. Set up auth state change subscription
     */
    initialize: async () => {
      // Prevent multiple initializations
      if (get().initialized) return;

      set({ status: "loading", isLoading: true, error: null });

      try {
        // 1. Fetch current session + roles
        await get().fetchSessionAndRoles();

        // 2. Set up listener
        if (!authSubscription) {
          authSubscription = supabase.auth.onAuthStateChange(handleAuthStateChange);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        set({ isLoading: false, initialized: true });
      }
    },

    login: async (email: string, password: string) => {
      try {
        set({ status: "loading", isLoading: true, error: null });

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // Attempt to fetch roles from the newly signed-in session
        await get().fetchSessionAndRoles(data.session);
      } catch (error) {
        console.error("Login error:", error);
        set({
          error: error instanceof AuthError ? error.message : "An error occurred during login",
          status: "unauthenticated",
        });
      } finally {
        set({ isLoading: false });
      }
    },

    logout: async () => {
      try {
        set({ status: "loading", isLoading: true, error: null });
        await supabase.auth.signOut();
        // Subscribing to SIGNED_OUT event will handle clearing state
      } catch (error) {
        console.error("Logout error:", error);
        set({
          error: error instanceof AuthError ? error.message : "An error occurred during logout",
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
        status: "idle",
        initialized: true,
        isLoading: false,
      });
    },
  };
};
