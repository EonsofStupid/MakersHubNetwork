// src/stores/auth/types/auth.types.ts

import { User, Session } from "@supabase/supabase-js";

// Example user-role enumeration
export type UserRole = "admin" | "editor" | "viewer";

// Example status
export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

/**
 * AuthState - the shape of your authentication state
 */
export interface AuthState {
  user: User | null;
  session: Session | null;
  roles: UserRole[];
  status: AuthStatus;
  error: string | null;
  initialized: boolean;
}

/**
 * AuthActions - all the actions/methods that modify or use AuthState
 */
export interface AuthActions {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setRoles: (roles: UserRole[]) => void;
  setStatus: (status: AuthStatus) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

/**
 * AuthStore = AuthState & AuthActions
 */
export type AuthStore = AuthState & AuthActions;
