import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, AuthStore, UserRole } from "./types";
import { supabase } from "@/integrations/supabase/client";

const initialState: AuthState = {
  user: null,
  session: null,
  roles: [],
  status: "idle",
  error: null,
  isLoading: false,
  initialized: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // State setters
      setUser: (user) => set({ user }),
      setSession: (session) => 
        set({ 
          session,
          user: session?.user ?? null,
          status: session ? "authenticated" : "unauthenticated",
        }),
      setRoles: (roles) => set({ roles }),
      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),
      setInitialized: (initialized) => set({ initialized }),

      // Auth actions
      initialize: async () => {
        try {
          set({ status: "loading", isLoading: true, error: null });
          
          const { data: { session }, error: sessionError } = 
            await supabase.auth.getSession();
          
          if (sessionError) throw sessionError;

          if (session) {
            const { data: roles } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", session.user.id);

            set({
              user: session.user,
              session,
              roles: roles?.map((r) => r.role as UserRole) || [],
              status: "authenticated",
              error: null,
            });
          } else {
            set({
              user: null,
              session: null,
              roles: [],
              status: "unauthenticated",
              error: null,
            });
          }
        } catch (err) {
          console.error("Auth initialization error:", err);
          set({
            error: err instanceof Error ? err.message : "Authentication error",
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
          set({
            user: null,
            session: null,
            roles: [],
            status: "unauthenticated",
            error: null,
          });
        } catch (err) {
          console.error("Logout error:", err);
          set({
            error: err instanceof Error ? err.message : "Logout error",
          });
        } finally {
          set({ isLoading: false });
        }
      },

      // Role checks
      hasRole: (role) => get().roles.includes(role),
      isAdmin: () => get().roles.some(role => ["admin", "super_admin"].includes(role)),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        roles: state.roles,
        status: state.status,
      }),
    }
  )
);