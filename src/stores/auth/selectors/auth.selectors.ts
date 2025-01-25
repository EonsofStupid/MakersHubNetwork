import { StateCreator } from "zustand";
import { AuthState, AuthActions, AuthStore, AuthStatus } from "../types/auth.types";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";

export const createAuthSlice: StateCreator<AuthStore, [], [], AuthStore> = (set, get) => {
  let authSubscription: { data: { subscription: any } } | null = null;

  async function fetchSessionAndRoles(sessionParam?: any) {
    try {
      const session =
        sessionParam ?? (await supabase.auth.getSession()).data.session;

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

  function subscribeAuthStateChange() {
    if (authSubscription) {
      return;
    }

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AUTH STATE CHANGED:", event, session?.user?.id);

      if (event === "SIGNED_IN" && session?.user) {
        await fetchSessionAndRoles(session);
      } else if (event === "SIGNED_OUT") {
        get().clearState();
        set({ status: "unauthenticated" });
      }
    });

    authSubscription = data;
  }

  return {
    user: null,
    session: null,
    roles: [],
    status: "idle" as AuthStatus,
    error: null,
    initialized: false,
    isLoading: false,

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

    hasRole: (role) => get().roles.includes(role),
    isAdmin: () => get().roles.includes("admin"),

    login: async (email: string, password: string) => {
      try {
        set({ status: "loading", isLoading: true, error: null });

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

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

    logout: async () => {
      try {
        set({ status: "loading", isLoading: true, error: null });
        await supabase.auth.signOut();
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
        status: "idle",
        initialized: true,
        isLoading: false,
      });
    },
  };
};