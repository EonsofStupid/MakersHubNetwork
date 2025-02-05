import { StateCreator } from "zustand"
import { supabase } from "@/integrations/supabase/client"
import { AuthError } from "@supabase/supabase-js"
import { AuthStore, AuthState, AuthActions, AuthStatus } from "../types/auth.types"
import { UserRole } from "@/types/auth.types"

export const createAuthSlice: StateCreator<AuthStore> = (set, get) => ({
  user: null,
  session: null,
  roles: [],
  status: "idle" as AuthStatus,
  error: null,
  isLoading: false,
  initialized: false,

  setUser: (user) => set({ user }),
  setSession: (session) => {
    set({
      session,
      user: session?.user ?? null,
      status: session ? "authenticated" : "unauthenticated"
    })
  },
  setRoles: (roles) => set({ roles }),
  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (initialized) => set({ initialized }),
  setStatus: (status) => set({ status }),

  // Role checks using UUID
  hasRole: (role) => get().roles.includes(role),
  isAdmin: () => get().roles.includes("admin") || get().roles.includes("super_admin"),

  initialize: async () => {
    try {
      set({ isLoading: true, error: null, status: "loading" })
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError

      if (session?.user?.id) {
        // Get user roles using UUID
        const { data: roles, error: rolesError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
        if (rolesError) throw rolesError

        set({
          user: session.user,
          session,
          roles: (roles?.map((r) => r.role) as UserRole[]) || [],
          status: "authenticated",
          error: null,
        })
      } else {
        set({
          user: null,
          session: null,
          roles: [],
          status: "unauthenticated",
          error: null,
        })
      }
    } catch (err) {
      console.error("Auth initialization error:", err)
      set({
        error: err instanceof AuthError ? err.message : "An error occurred during initialization",
        user: null,
        session: null,
        roles: [],
        status: "unauthenticated"
      })
    } finally {
      set({ isLoading: false, initialized: true })
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null })
      await supabase.auth.signOut()
      set({
        user: null,
        session: null,
        roles: [],
        status: "unauthenticated",
        error: null,
      })
    } catch (err) {
      console.error("Logout error:", err)
      set({
        error: err instanceof AuthError ? err.message : "An error occurred during logout",
      })
    } finally {
      set({ isLoading: false })
    }
  },
})
