
import { StateCreator } from "zustand";
import { AuthState, AuthActions, AuthStore, UserRole } from "../types/auth.types";
import { supabase } from "@/integrations/supabase/client";

export const createActionsSlice: StateCreator<
  AuthStore,
  [],
  [],
  Pick<AuthActions, "setLoading" | "setInitialized" | "hasRole" | "initialize" | "logout">
> = (set, get) => ({
  // Set loading state
  setLoading: (isLoading) => set({ isLoading }),
  
  // Set initialization state
  setInitialized: (initialized) => set({ initialized }),
  
  // Check if user has a specific role
  hasRole: (role: UserRole) => {
    const { roles } = get();
    return roles.includes(role);
  },
  
  // Initialize the auth state by fetching the current session
  initialize: async () => {
    try {
      set({ isLoading: true });
      
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Set session and user
        set({ 
          session, 
          user: session.user,
          status: "authenticated"
        });
        
        // Fetch user roles if authenticated
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);
          
        if (rolesError) {
          console.error("Error fetching user roles:", rolesError);
          set({ roles: [] });
        } else {
          const userRoles = rolesData.map(r => r.role as UserRole);
          set({ roles: userRoles });
        }
      } else {
        // No active session
        set({ 
          session: null, 
          user: null, 
          roles: [],
          status: "unauthenticated"
        });
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({ 
        error: error instanceof Error ? error.message : "Failed to initialize authentication",
        status: "unauthenticated"
      });
    } finally {
      set({ isLoading: false, initialized: true });
    }
  },
  
  // Log the user out
  logout: async () => {
    try {
      set({ isLoading: true });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Clear auth state
      set({ 
        user: null, 
        session: null, 
        roles: [], 
        status: "unauthenticated" 
      });
      
    } catch (error) {
      console.error("Error during logout:", error);
      set({ 
        error: error instanceof Error ? error.message : "Failed to log out"
      });
    } finally {
      set({ isLoading: false });
    }
  }
});
