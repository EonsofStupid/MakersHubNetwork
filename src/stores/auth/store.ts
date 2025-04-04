
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthStatus, UserRole } from '@/auth/types/auth.types';
import { AuthState, AuthStore } from './types';
import { supabase } from '@/integrations/supabase/client';
import { authStorage } from './middleware/persist.middleware';
import { getLogger } from '@/logging';
import { LogCategory } from '@/constants/logLevel';
import { safeDetails } from '@/logging/utils/safeDetails';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      session: null,
      roles: [],
      isLoading: true,
      error: null,
      status: AuthStatus.LOADING,
      initialized: false,
      isAuthenticated: false,
      
      // Methods
      setUser: (user) => set({ user }),
      setSession: (session) => set({ 
        session,
        user: session?.user ?? null,
        status: session ? AuthStatus.AUTHENTICATED : AuthStatus.UNAUTHENTICATED,
        isAuthenticated: !!session
      }),
      setRoles: (roles) => set({ roles }),
      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),
      setInitialized: (initialized) => set({ initialized }),
      setStatus: (status) => set({ 
        status,
        isAuthenticated: status === AuthStatus.AUTHENTICATED
      }),
      
      // Role checking
      hasRole: (role) => get().roles.includes(role),
      isAdmin: () => get().roles.includes(UserRole.ADMIN) || get().roles.includes(UserRole.SUPER_ADMIN),
      
      // Initialize authentication
      initialize: async () => {
        const logger = getLogger();
        try {
          set({ isLoading: true, error: null });
          
          logger.info('Initializing auth store', {
            category: LogCategory.AUTH,
            source: 'auth/store'
          });
          
          // Get current session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            throw sessionError;
          }
          
          if (session) {
            // Fetch user roles if we have a session
            const { data: rolesData, error: rolesError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id);
              
            if (rolesError) {
              throw rolesError;
            }
            
            const roles = (rolesData?.map(r => r.role) as UserRole[]) || [];
            
            set({
              user: session.user,
              session,
              roles,
              status: AuthStatus.AUTHENTICATED,
              isAuthenticated: true,
              error: null
            });
            
            logger.info('User authenticated', {
              category: LogCategory.AUTH,
              source: 'auth/store',
              details: { 
                userId: session.user.id,
                rolesCount: roles.length 
              }
            });
          } else {
            set({
              user: null,
              session: null,
              roles: [],
              status: AuthStatus.UNAUTHENTICATED,
              isAuthenticated: false,
              error: null
            });
            
            logger.info('No user session found', {
              category: LogCategory.AUTH,
              source: 'auth/store'
            });
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          
          logger.error('Auth initialization error', {
            category: LogCategory.AUTH,
            source: 'auth/store',
            details: safeDetails(err)
          });
          
          set({
            error: errorMessage,
            status: AuthStatus.ERROR,
            isAuthenticated: false
          });
        } finally {
          set({ 
            isLoading: false,
            initialized: true
          });
        }
      },
      
      // Logout
      logout: async () => {
        const logger = getLogger();
        try {
          set({ isLoading: true });
          
          logger.info('User logging out', {
            category: LogCategory.AUTH,
            source: 'auth/store'
          });
          
          await supabase.auth.signOut();
          
          set({
            user: null,
            session: null,
            roles: [],
            status: AuthStatus.UNAUTHENTICATED,
            isAuthenticated: false,
            error: null
          });
          
          logger.info('User logged out successfully', {
            category: LogCategory.AUTH,
            source: 'auth/store'
          });
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          
          logger.error('Logout error', {
            category: LogCategory.AUTH,
            source: 'auth/store',
            details: safeDetails(err)
          });
          
          set({ error: errorMessage });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: authStorage,
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        roles: state.roles,
        status: state.status,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
