import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "../types/auth.types";
import { getLogger } from "@/logging";
import { LogCategory } from "@/logging";

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
    const logger = getLogger();
    logger.info('Auth store initialization started', {
      category: LogCategory.AUTH,
      source: 'auth.store'
    });
    
    // Don't initialize multiple times
    if (get().initialized) {
      logger.info('Auth already initialized, skipping', {
        category: LogCategory.AUTH,
        source: 'auth.store'
      });
      return;
    }

    try {
      set({ isLoading: true, status: "loading" });
      
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      // Set the session from the response
      get().setSession(data.session);
      
      logger.info('Auth initialization completed', {
        category: LogCategory.AUTH,
        source: 'auth.store',
        details: { 
          hasSession: !!data.session,
          status: data.session ? 'authenticated' : 'unauthenticated'
        } as Record<string, any> | undefined
      });

      // Mark as initialized
      set({ initialized: true, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Authentication failed";
      
      logger.error('Auth initialization error', {
        category: LogCategory.AUTH,
        source: 'auth.store',
        details: error as Record<string, any> | undefined
      });
      
      set({ 
        error: errorMessage, 
        status: "error",
        isLoading: false,
        initialized: true // Still mark as initialized even if there's an error
      });
    }
  },
  
  logout: async () => {
    const logger = getLogger();
    try {
      set({ isLoading: true });
      
      logger.info('User logging out', {
        category: LogCategory.AUTH,
        source: 'auth.store'
      });
      
      await supabase.auth.signOut();
      
      set({
        user: null,
        session: null,
        roles: [],
        status: "unauthenticated",
        isLoading: false,
        isAuthenticated: false
      });
      
      logger.info('User logged out successfully', {
        category: LogCategory.AUTH,
        source: 'auth.store'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Logout failed";
      
      logger.error('Logout error', {
        category: LogCategory.AUTH,
        source: 'auth.store',
        details: error as Record<string, any> | undefined
      });
      
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  }
}));
