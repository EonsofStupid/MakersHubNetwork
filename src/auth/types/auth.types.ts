
import { User, Session } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";

// Base role type from database
export type UserRole = Database["public"]["Enums"]["user_role"];

// Auth status enum
export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

// Core auth state interface
export interface AuthState {
  user: User | null;
  session: Session | null;
  roles: UserRole[];
  status: AuthStatus;
  error: string | null;
  isLoading: boolean;
  initialized: boolean;
}

// Basic user profile interface
export interface UserProfile {
  id: string;
  display_name?: string | null;
  avatar_url?: string | null;
  primary_role_id?: string | null;
}

// Event types for auth bridge
export type AuthEventType = 
  | "AUTH_READY" 
  | "AUTH_SIGNED_IN" 
  | "AUTH_SIGNED_OUT" 
  | "AUTH_USER_UPDATED" 
  | "AUTH_SESSION_UPDATED" 
  | "AUTH_ERROR";

// Auth event payload interface
export interface AuthEvent {
  type: AuthEventType;
  payload?: {
    user?: User | null;
    session?: Session | null;
    roles?: UserRole[];
    error?: string | null;
  };
}

// Auth event handler type
export type AuthEventHandler = (event: AuthEvent) => void;
