
import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthStatus } from "../types/auth.types";
import { UserRole, ROLES } from "@/types/shared";
import { mapRoleStringsToEnums } from "../types/roles";
import { getLogger } from "@/logging";
import { LogCategory } from "@/logging";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from 'uuid';

// Define user profile interface
export interface UserProfile {
  id: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  roles: UserRole[];
  status: AuthStatus;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  isAuthenticated: boolean;
  storeId: string;
  lastUpdated: number;
  hydrationAttempted: boolean;
}

export interface AuthActions {
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setRoles: (roles: UserRole[]) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setStatus: (status: AuthStatus) => void;
  
  initialize: () => Promise<void>;
  loadUserProfile: (userId: string) => Promise<void>;
  logout: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      profile: null,
      roles: [],
      status: "idle",
      isLoading: false,
      error: null,
      initialized: false,
      isAuthenticated: false,
      storeId: uuidv4(),
      lastUpdated: Date.now(),
      hydrationAttempted: false,
      
      hasRole: (role: UserRole | UserRole[]) => {
        const userRoles = get().roles;
        
        if (Array.isArray(role)) {
          return role.some(r => userRoles.includes(r));
        }
        
        return userRoles.includes(role);
      },
      
      isAdmin: () => {
        const roles = get().roles;
        return roles.includes(ROLES.ADMIN) || roles.includes(ROLES.SUPER_ADMIN);
      },
      
      isSuperAdmin: () => {
        return get().roles.includes(ROLES.SUPER_ADMIN);
      },
      
      setUser: (user: User | null) => {
        set({ 
          user,
          lastUpdated: Date.now()
        });
        
        if (user) {
          get().loadUserProfile(user.id);
        } else {
          set({ profile: null });
        }
      },
      
      setProfile: (profile: UserProfile | null) => {
        set({
          profile,
          lastUpdated: Date.now()
        });
      },
      
      setRoles: (roles: UserRole[]) => {
        set({ 
          roles,
          lastUpdated: Date.now()
        });
      },
      
      setError: (error: string | null) => {
        set({ 
          error,
          lastUpdated: Date.now()
        });
      },
      
      setLoading: (isLoading: boolean) => {
        set({ 
          isLoading,
          lastUpdated: Date.now()
        });
      },
      
      setInitialized: (initialized: boolean) => {
        set({ 
          initialized,
          lastUpdated: Date.now()
        });
      },
      
      setStatus: (status: AuthStatus) => {
        set({
          status,
          lastUpdated: Date.now()
        });
      },
      
      setSession: (session: Session | null) => {
        const currentUser = session?.user || null;
        
        let roles: UserRole[] = [];
        if (currentUser?.app_metadata?.roles && Array.isArray(currentUser.app_metadata.roles)) {
          // Convert string roles to enum roles
          const roleStrings = currentUser.app_metadata.roles as string[];
          roles = mapRoleStringsToEnums(roleStrings);
        }
        
        set({
          session,
          user: currentUser,
          roles,
          status: session ? "authenticated" : "unauthenticated",
          isAuthenticated: !!session,
          lastUpdated: Date.now()
        });
      },
      
      loadUserProfile: async (userId: string) => {
        const logger = getLogger();
        
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
            
          if (error) {
            logger.warn('Failed to load user profile from database', {
              category: LogCategory.AUTH,
              source: 'auth.store',
              details: { error: error.message }
            });
            
            const user = get().user;
            if (user) {
              const profile: UserProfile = {
                id: user.id,
                display_name: user.user_metadata?.full_name as string || undefined,
                avatar_url: user.user_metadata?.avatar_url as string || undefined,
              };
              
              set({ 
                profile,
                lastUpdated: Date.now()
              });
            }
            
            return;
          }
          
          set({ 
            profile: data as UserProfile,
            lastUpdated: Date.now()
          });
          
          logger.info('User profile loaded successfully', {
            category: LogCategory.AUTH,
            source: 'auth.store'
          });
          
        } catch (error) {
          logger.error('Error loading user profile', {
            category: LogCategory.AUTH,
            source: 'auth.store',
            details: { 
              error: error instanceof Error ? error.message : String(error),
              userId 
            }
          });
        }
      },
      
      initialize: async () => {
        const logger = getLogger();
        
        if (get().initialized || get().hydrationAttempted) {
          logger.info('Auth already initialized or attempted, skipping', {
            category: LogCategory.AUTH,
            source: 'auth.store'
          });
          return;
        }

        try {
          set({ 
            isLoading: true, 
            status: "loading", 
            hydrationAttempted: true,
            lastUpdated: Date.now()
          });
          
          logger.info('Auth store initialization started', {
            category: LogCategory.AUTH,
            source: 'auth.store'
          });
          
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          
          get().setSession(data.session);
          
          if (data.session?.user) {
            await get().loadUserProfile(data.session.user.id);
          }
          
          logger.info('Auth initialization completed', {
            category: LogCategory.AUTH,
            source: 'auth.store',
            details: { 
              hasSession: !!data.session,
              status: data.session ? 'authenticated' : 'unauthenticated'
            }
          });

          set({ 
            initialized: true, 
            isLoading: false,
            lastUpdated: Date.now()
          });
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
            initialized: true,
            lastUpdated: Date.now()
          });
        }
      },
      
      logout: async () => {
        const logger = getLogger();
        try {
          set({ 
            isLoading: true,
            lastUpdated: Date.now()
          });
          
          logger.info('User logging out', {
            category: LogCategory.AUTH,
            source: 'auth.store'
          });
          
          await supabase.auth.signOut();
          
          set({
            user: null,
            profile: null,
            session: null,
            roles: [],
            status: "unauthenticated",
            isLoading: false,
            isAuthenticated: false,
            lastUpdated: Date.now()
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
          
          set({ 
            error: errorMessage, 
            isLoading: false,
            lastUpdated: Date.now()
          });
          throw error;
        }
      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        profile: state.profile,
        roles: state.roles,
        status: state.status,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const selectUser = (state: AuthStore) => state.user;
export const selectSession = (state: AuthStore) => state.session;
export const selectProfile = (state: AuthStore) => state.profile;
export const selectRoles = (state: AuthStore) => state.roles;
export const selectStatus = (state: AuthStore) => state.status;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectIsAdmin = (state: AuthStore) => state.isAdmin();
export const selectIsSuperAdmin = (state: AuthStore) => state.isSuperAdmin();
export const selectAuthError = (state: AuthStore) => state.error;
export const selectIsLoading = (state: AuthStore) => state.isLoading;
