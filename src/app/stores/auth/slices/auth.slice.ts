import { StateCreator } from "zustand"
import { supabase } from "@/app/integrations/supabase/client"
import { AuthError } from "@supabase/supabase-js"
import { AuthStore, AuthStatus, UserRole } from "../types/auth.types"

export const createAuthSlice: StateCreator<AuthStore> = (set, get) => ({
  // Initial state
  user: null,
  session: null,
  roles: [],
  status: "idle" as AuthStatus,
  error: null,
  isLoading: false,
  initialized: false,

  // State setters
  setUser: (user) => set({ user }),
  setSession: (session) => {
    set({
      session,
      user: session?.user ?? null,
      status: session ? "authenticated" : "unauthenticated"
    })
  },
  setRoles: (roles) => {
    console.log("Setting roles in auth store:", roles)
    set({ roles })
  },
  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (initialized) => set({ initialized }),
  setStatus: (status) => set({ status }),

  // Role checks
  hasRole: (role) => get().roles.includes(role),
  isAdmin: () => get().roles.includes("admin") || get().roles.includes("super_admin"),

  // Auth actions
  initialize: async () => {
    try {
      set({ isLoading: true, error: null, status: "loading" })
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError

      if (session?.user?.id) {
        // Fetch roles from the centralized store only once here
        const { data: rolesData, error: rolesError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
        if (rolesError) throw rolesError

        const roles = (rolesData?.map((r) => r.role) as UserRole[]) || []

        set({
          user: session.user,
          session,
          roles,
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
        error: err instanceof AuthError ? err.message : "An error occurred during logout"
      })
      throw err // Re-throw to handle in the component if needed
    } finally {
      set({ isLoading: false })
    }
  },
}) 