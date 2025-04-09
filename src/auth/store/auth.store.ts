import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserRole, AuthStatus } from "../types/auth.types";
import { getLogger } from "@/logging";
import { LogCategory } from "@/logging";

interface AuthState {
  user: User | null;
  session: Session | null;
  roles: UserRole[];
  status: AuthStatus;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  isAuthenticated: boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setRoles: (roles: UserRole[]) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
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
  
  hasRole: (role: UserRole | UserRole[]) => {
    const userRoles = get().roles;
    
    if (Array.isArray(role)) {
      return role.some(r => userRoles.includes(r));
    }
    
    return userRoles.includes(role);
  },
  
  isAdmin: () => {
    const roles = get().roles;
    return roles.includes("admin") || roles.includes("super_admin");
  },
  
  isSuperAdmin: () => {
    return get().roles.includes("super_admin");
  },

  setUser: (user: User | null) => {
    set({ user });
  },

  setRoles: (roles: UserRole[]) => {
    set({ roles });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setInitialized: (initialized: boolean) => {
    set({ initialized });
  },
  
  setSession: (session: Session | null) => {
    const currentUser = session?.user || null;
    
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
      
      get().setSession(data.session);
      
      logger.info('Auth initialization completed', {
        category: LogCategory.AUTH,
        source: 'auth.store',
        details: { 
          hasSession: !!data.session,
          status: data.session ? 'authenticated' : 'unauthenticated'
        }
      });

      set({ initialized: true, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Authentication failed";
      
      logger.error('Auth initialization error', {
        category: LogCategory.AUTH,
        source: 'auth.store',
        details: error
      });
      
      set({ 
        error: errorMessage, 
        status: "error",
        isLoading: false,
        initialized: true
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
        details: error
      });
      
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  }
}));
