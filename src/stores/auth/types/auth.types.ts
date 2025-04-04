
import { User, Session } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";
import { AuthStatus } from "@/auth/types/auth.types";

export type UserRole = Database["public"]["Enums"]["user_role"];

export interface AuthState {
  user: User | null;
  session: Session | null;
  roles: UserRole[];
  isLoading: boolean;
  error: string | null;
  status: AuthStatus;
  initialized: boolean;
  isAuthenticated: boolean;
}

export interface AuthActions {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setRoles: (roles: UserRole[]) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setStatus: (status: AuthStatus) => void;
  hasRole: (role: UserRole) => boolean;
  isAdmin: () => boolean;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;

export interface AdminAccess {
  isAdmin: boolean;
  hasAdminAccess: boolean;
}

export interface WithAdminAccess {
  hasAdminAccess: boolean;
}

// Re-export AuthStatus for internal use
export { AuthStatus };
