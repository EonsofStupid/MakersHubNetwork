
import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserRole, AuthStatus } from "../types/auth.types";
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
  storeId: string; // Used for debugging and identifying store instances
  lastUpdated: number; // Timestamp to track updates
  hydrationAttempted: boolean; // Flag to prevent multiple hydration attempts
}

export interface AuthActions {
  // Role checking
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  
  // State setters
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setRoles: (roles: UserRole[]) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setStatus: (status: AuthStatus) => void;
  
  // Operations
  initialize: () => Promise<void>;
  loadUserProfile: (userId: string) => Promise<void>;
  logout: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

// Create the auth store with persistence
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      session: null,
      profile: null,
      roles: [],
      status: "idle",
      isLoading: false,
      error: null,
      initialized: false,
      isAuthenticated: false,
      storeId: uuidv4(), // Unique ID for this store instance
      lastUpdated: Date.now(),
      hydrationAttempted: false,
      
      // Role checking methods
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

      // State setters
      setUser: (user: User | null) => {
        set({ 
          user,
          lastUpdated: Date.now()
        });
        
        // If user is set, attempt to load their profile
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
      
      // Session setter - updates multiple related fields
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
          lastUpdated: Date.now()
        });
      },
      
      // Load user profile from database
      loadUserProfile: async (userId: string) => {
        const logger = getLogger();
        
        try {
          // Try to get profile from profiles table if it exists
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
            
          if (error) {
            // If the query failed (e.g., table doesn't exist), create a basic profile from user metadata
            logger.warn('Failed to load user profile from database', {
              category: LogCategory.AUTH,
              source: 'auth.store',
              details: { error: error.message }
            });
            
            // Get user from current state
            const user = get().user;
            if (user) {
              // Create profile from user metadata
              const profile: UserProfile = {
                id: user.id,
                display_name: user.user_metadata?.full_name as string || null,
                avatar_url: user.user_metadata?.avatar_url as string || null,
              };
              
              set({ 
                profile,
                lastUpdated: Date.now()
              });
            }
            
            return;
          }
          
          // If we got data from the database, use it
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
      
      // Initialize auth - loads session from supabase
      initialize: async () => {
        const logger = getLogger();
        // Get current state
        const { initialized, hydrationAttempted } = get();
        
        // Prevent multiple initializations
        if (initialized || hydrationAttempted) {
          logger.info('Auth already initialized or attempted, skipping', {
            category: LogCategory.AUTH,
            source: 'auth.store'
          });
          return;
        }

        try {
          // Mark that we've attempted hydration to prevent multiple attempts
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
          
          // Get session from Supabase
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          
          // Update session state
          get().setSession(data.session);
          
          // If we have a user, load their profile
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

          // Mark as initialized
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
      
      // Logout user
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
        // Only persist these fields
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

// Export selectors for optimized component usage
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
