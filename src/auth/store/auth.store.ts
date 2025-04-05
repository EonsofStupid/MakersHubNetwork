
import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "../types/auth.types";

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated" | "error";

interface AuthState {
  user: User | null;
  session: Session | null;
  roles: UserRole[];
  status: AuthStatus;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  isAdmin: () => boolean;
  setSession: (session: Session | null) => void;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  roles: [],
  status: "idle",
  isLoading: false,
  error: null,
  initialized: false,
  isAuthenticated: false,
  
  hasRole: (role: UserRole) => {
    return get().roles.includes(role);
  },
  
  isAdmin: () => {
    const roles = get().roles;
    return roles.includes("admin") || roles.includes("super_admin");
  },
  
  setSession: (session: Session | null) => {
    const currentUser = session?.user || null;
    
    // Derive roles from user metadata when available
    const roles: UserRole[] = [];
    if (currentUser?.app_metadata?.roles && Array.isArray(currentUser.app_metadata.roles)) {
      roles.push(...currentUser.app_metadata.roles);
    }
    
    set({
      session,
      user: currentUser,
      roles,
      status: session ? "authenticated" : "unauthenticated",
      isAuthenticated: !!session,
    });
  },
  
  initialize: async () => {
    // Don't initialize multiple times
    if (get().initialized) {
      return;
    }

    try {
      set({ isLoading: true, status: "loading" });
      
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      // Set the session from the response
      get().setSession(data.session);

      // Mark as initialized
      set({ initialized: true, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Authentication failed", 
        status: "error",
        isLoading: false,
        initialized: true // Still mark as initialized even if there's an error
      });
    }
  },
  
  logout: async () => {
    try {
      set({ isLoading: true });
      await supabase.auth.signOut();
      set({
        user: null,
        session: null,
        roles: [],
        status: "unauthenticated",
        isLoading: false,
        isAuthenticated: false
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Logout failed", 
        isLoading: false 
      });
    }
  }
}));
