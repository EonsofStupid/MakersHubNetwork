import { User, Session } from "@supabase/supabase-js"

export type UserRole = "user" | "admin" | "super_admin"

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated"

export interface AuthState {
  user: User | null
  session: Session | null
  roles: UserRole[]
  status: AuthStatus // This was missing
  error: string | null
  isLoading: boolean
  initialized: boolean
}

export interface AuthActions {
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setRoles: (roles: UserRole[]) => void
  setError: (error: string | null) => void
  setLoading: (isLoading: boolean) => void
  setInitialized: (initialized: boolean) => void
  setStatus: (status: AuthStatus) => void // This was missing
  hasRole: (role: UserRole) => boolean
  isAdmin: () => boolean
  initialize: () => Promise<void>
  logout: () => Promise<void>
}

export type AuthStore = AuthState & AuthActions