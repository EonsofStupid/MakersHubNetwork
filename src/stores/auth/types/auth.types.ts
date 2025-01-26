import { Database } from "@/integrations/supabase/types";

export type UserRole = Database["public"]["Enums"]["user_role"];

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

export interface AuthState {
  user: any;
  session: any;
  roles: UserRole[];
  status: AuthStatus;
  error: string | null;
  initialized: boolean;
  isLoading: boolean;
}

export interface AuthActions {
  setUser: (user: any) => void;
  setSession: (session: any) => void;
  setRoles: (roles: UserRole[]) => void;
  setError: (error: string | null) => void;
  setStatus: (status: AuthStatus) => void;
  setInitialized: (initialized: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  hasRole: (role: UserRole) => boolean;
  isAdmin: () => boolean;
  login: (email: string, password: string) => Promise<void>;
  initialize: () => Promise<void>;
  clearState: () => void;
  logout: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;