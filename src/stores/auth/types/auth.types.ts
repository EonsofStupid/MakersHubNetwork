import { User, Session } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";

export type UserRole = Database["public"]["Enums"]["user_role"];

export interface AuthState {
  user: User | null;
  session: Session | null;
  roles: UserRole[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface AuthActions {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setRoles: (roles: UserRole[]) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  logout: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;