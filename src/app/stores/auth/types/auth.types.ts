
import type { User, Session } from "@supabase/supabase-js"
import type { UserRole } from "@/types/auth.types"

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated"

export interface AuthState {
  user: User | null
  session: Session | null
  role: UserRole | null
  status: AuthStatus
  error: string | null
  isLoading: boolean
  initialized: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  initialize: () => Promise<void>
  logout: () => Promise<void>
}

export interface AuthActions {
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setRole: (role: UserRole | null) => void
  setError: (error: string | null) => void
  setLoading: (isLoading: boolean) => void
  setInitialized: (initialized: boolean) => void
  setStatus: (status: AuthStatus) => void
  initialize: () => Promise<void>
  logout: () => Promise<void>
}

export type AuthStore = AuthState & AuthActions
