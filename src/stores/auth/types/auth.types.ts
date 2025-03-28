
import type { User, Session } from "@supabase/supabase-js"
import type { UserRole as GlobalUserRole } from "@/types/auth.types"

// Re-export with proper type syntax for isolated modules
export type UserRole = GlobalUserRole

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated"

export interface AuthState {
  user: User | null
  session: Session | null
  roles: UserRole[]
  status: AuthStatus
  error: string | null
  isLoading: boolean
  initialized: boolean
}

export interface AuthSlice {
  status: AuthStatus
  session: Session | null
  user: User | null
  roles: UserRole[]
  setSession: (session: Session | null) => void
  setUser: (user: User | null) => void
  setRoles: (roles: UserRole[]) => void
  clearUser: () => void
  setStatus: (status: AuthStatus) => void
  isAdmin: () => boolean
}

export interface UiSlice {
  error: string | null
  setError: (error: string | null) => void
}

export interface ActionsSlice {
  setLoading: (isLoading: boolean) => void
  setInitialized: (initialized: boolean) => void
  hasRole: (role: UserRole) => boolean
  isAdmin: () => boolean
  initialize: () => Promise<void>
  logout: () => Promise<void>
}

export type AuthStore = AuthState & AuthSlice & UiSlice & ActionsSlice
