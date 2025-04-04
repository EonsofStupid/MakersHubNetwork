
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, AuthStatus, UserRole } from "../types/auth.types";
import { AuthUser, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getLogger } from "@/logging";
import { LogCategory } from "@/logging/types";
import { safeDetails } from '@/logging/utils/safeDetails';

interface AuthStore extends AuthState {
  // State setters
  setUser: (user: AuthUser | null) => void;
  setSession: (session: Session | null) => void;
  setRoles: (roles: UserRole[]) => void;
  setStatus: (status: AuthStatus) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  
  // Auth actions
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
  
  // Permissions
  hasRole: (role: UserRole) => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      session: null,
      roles: [],
      status: AuthStatus.LOADING,
      error: null,
      isLoading: false,
      initialized: false,
      isAuthenticated: false,

      // State setters
      setUser: (user) => set({ 
        user,
        isAuthenticated: !!user
      }),
      
      setSession: (session) => {
        set({
          session,
          user: session?.user ?? null,
          status: session ? AuthStatus.AUTHENTICATED : AuthStatus.UNAUTHENTICATED,
          isAuthenticated: !!session
        });
      },
      
      setRoles: (roles) => {
        const logger = getLogger();
        logger.debug("Setting roles in auth store", { 
          category: LogCategory.AUTH,
          details: { roles }
        });
        set({ roles });
      },
      
      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),
      setInitialized: (initialized) => set({ initialized }),
      setStatus: (status) => set({ status }),

      // Role checks
      hasRole: (role) => get().roles.includes(role),
      isAdmin: () => get().roles.includes("admin") || get().roles.includes("super_admin"),

      // Auth actions
      initialize: async () => {
        const logger = getLogger();
        try {
          set({ isLoading: true, error: null, status: AuthStatus.LOADING });
          
          logger.info("Initializing auth store", { 
            category: LogCategory.AUTH
          });
          
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;

          if (session?.user?.id) {
            // Fetch roles
            const { data: rolesData, error: rolesError } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", session.user.id);
              
            if (rolesError) throw rolesError;

            const roles = (rolesData?.map((r) => r.role) as UserRole[]) || [];

            logger.info("User authenticated", { 
              category: LogCategory.AUTH,
              details: { 
                userId: session.user.id,
                rolesCount: roles.length 
              }
            });

            set({
              user: session.user,
              session,
              roles,
              status: AuthStatus.AUTHENTICATED,
              error: null,
              isAuthenticated: true
            });
          } else {
            logger.info("No user session found", { 
              category: LogCategory.AUTH 
            });
            
            set({
              user: null,
              session: null,
              roles: [],
              status: AuthStatus.UNAUTHENTICATED,
              error: null,
              isAuthenticated: false
            });
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Unknown error";
          logger.error('Auth initialization error', {
            category: LogCategory.AUTH,
            details: safeDetails(err)
          });
          
          set({
            error: errorMessage,
            user: null,
            session: null,
            roles: [],
            status: AuthStatus.UNAUTHENTICATED,
            isAuthenticated: false
          });
        } finally {
          set({ isLoading: false, initialized: true });
        }
      },

      logout: async () => {
        const logger = getLogger();
        try {
          set({ isLoading: true, error: null });
          
          logger.info("User logging out", { 
            category: LogCategory.AUTH
          });
          
          await supabase.auth.signOut();
          
          set({
            user: null,
            session: null,
            roles: [],
            status: AuthStatus.UNAUTHENTICATED,
            error: null,
            isAuthenticated: false
          });
          
          logger.info("User logged out successfully", { 
            category: LogCategory.AUTH
          });
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Unknown error";
          logger.error('Logout error', {
            category: LogCategory.AUTH,
            details: safeDetails(err)
          });
          
          set({
            error: errorMessage
          });
          
          throw err; // Re-throw to handle in the component if needed
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        roles: state.roles,
      }),
    }
  )
);
