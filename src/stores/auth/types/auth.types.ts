import { User, Session } from "@supabase/supabase-js"
import { UserRole as GlobalUserRole } from "@/types/auth.types"

// Re-export UserRole for use in auth-related files
export { GlobalUserRole as UserRole }

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated"

export interface AuthState {
  user: User | null
  session: Session | null
  roles: GlobalUserRole[]
  status: AuthStatus
  error: string | null
  isLoading: boolean
  initialized: boolean
}

export interface AuthActions {
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setRoles: (roles: GlobalUserRole[]) => void
  setError: (error: string | null) => void
  setLoading: (isLoading: boolean) => void
  setInitialized: (initialized: boolean) => void
  setStatus: (status: AuthStatus) => void
  hasRole: (role: GlobalUserRole) => boolean
  isAdmin: () => boolean
  initialize: () => Promise<void>
  logout: () => Promise<void>
}

export type AuthStore = AuthState & AuthActions