import { User, Session } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";

export type UserRole = Database["public"]["Enums"]["user_role"];

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  user: User | null;
  session: Session | null;
  roles: UserRole[];
  status: AuthStatus;
  error: string | null;
  initialized: boolean;
}

export interface AuthActions {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setRoles: (roles: UserRole[]) => void;
  setError: (error: string | null) => void;
  setStatus: (status: AuthStatus) => void;
  setInitialized: (initialized: boolean) => void;
  hasRole: (role: UserRole) => boolean;
  isAdmin: () => boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearState: () => void;
}

export type AuthStore = AuthState & AuthActions;