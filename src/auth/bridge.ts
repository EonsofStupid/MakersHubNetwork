
import { useAuthStore } from "@/stores/auth/store";
import { User, Session } from "@supabase/supabase-js";
import { UserRole } from "./types/auth.types";

/**
 * Simplified auth state to be consumed by legacy components
 * and the new admin section
 */
export interface AuthBridgeState {
  user: User | null;
  session: Session | null;
  roles: UserRole[];
  error: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

/**
 * Bridge function to convert auth store state to a simpler format
 * This helps decouple the admin section from the specific auth store implementation
 */
export function getAuthBridgeState(): AuthBridgeState {
  const {
    user,
    session,
    roles,
    error,
    status,
  } = useAuthStore.getState();

  // Derive admin status from roles
  const isAdmin = (roles || []).includes("admin") || (roles || []).includes("super_admin");
  const isSuperAdmin = (roles || []).includes("super_admin");
  
  return {
    user: user || null,
    session: session || null,
    roles: roles || [],
    error: error || null,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated" && !!user,
    isAdmin,
    isSuperAdmin
  };
}

/**
 * Hook to access auth state from auth store in a simplified format
 * Useful for components that need access to auth state but don't need
 * to perform auth actions
 */
export function useAuthBridge(): AuthBridgeState {
  // Get initial state
  const initialState = getAuthBridgeState();
  
  // Subscribe to auth store changes
  const state = useAuthStore(state => ({
    user: state.user || null,
    session: state.session || null,
    roles: state.roles || [],
    error: state.error || null,
    isLoading: state.status === "loading",
    isAuthenticated: state.status === "authenticated" && !!state.user,
    isAdmin: (state.roles || []).includes("admin") || (state.roles || []).includes("super_admin"),
    isSuperAdmin: (state.roles || []).includes("super_admin")
  }));
  
  return state;
}

