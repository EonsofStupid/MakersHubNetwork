import { StateCreator } from "zustand"
import { supabase } from "@/integrations/supabase/client"
import { AuthError } from "@supabase/supabase-js"
import { AuthStore, AuthStatus } from "@/stores/auth/types/auth.types"

export const createAuthSlice: StateCreator<AuthStore> = (set, get) => ({
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

  initialize: async () => {
    try {
      set({ status: "loading", isLoading: true, error: null })
      
      // Get the initial session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError

      if (session) {
        // Get user roles if authenticated
        const { data: roles, error: rolesError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
        if (rolesError) throw rolesError

        set({
          user: session.user,
          session,
          roles: roles?.map((r) => r.role) || [],
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
        status: "unauthenticated",
        user: null,
        session: null,
        roles: [],
      })
    } finally {
      set({ isLoading: false, initialized: true })
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
    })
  },

  logout: async () => {
    try {
      set({ status: "loading", isLoading: true, error: null })
      await supabase.auth.signOut()
      get().clearState()
    } catch (err) {
      console.error("Logout error:", err)
      set({
        error: err instanceof AuthError ? err.message : "An error occurred during logout",
        status: "unauthenticated",
      })
    } finally {
      set({ isLoading: false })
    }
  },
})