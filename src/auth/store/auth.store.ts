
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, UserRole, AuthStatus } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { authStorage } from '@/auth/store/middleware/persist.middleware';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { publishAuthEvent } from '@/auth/bridge';

interface AuthActions {
  setUser: (user: AuthState['user']) => void;
  setSession: (session: AuthState['session']) => void;
  setRoles: (roles: UserRole[]) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  hasRole: (role: UserRole) => boolean;
  isAdmin: () => boolean;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      session: null,
      roles: [],
      isLoading: true,
      error: null,
      status: 'idle' as AuthStatus,
      initialized: false,
      isAuthenticated: false,
      
      // Methods
      setUser: (user) => set({ user }),
      setSession: (session) => set({ 
        session,
        user: session?.user ?? null,
        status: session ? 'authenticated' as AuthStatus : 'unauthenticated' as AuthStatus,
        isAuthenticated: !!session
      }),
      setRoles: (roles) => set({ roles }),
      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),
      setInitialized: (initialized) => set({ initialized }),
      
      // Role checking
      hasRole: (role) => get().roles.includes(role),
      isAdmin: () => get().roles.includes('admin') || get().roles.includes('super_admin'),
      
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
              status: 'authenticated' as AuthStatus,
              error: null,
              isAuthenticated: true
            });
            
            logger.info('User authenticated', {
              category: LogCategory.AUTH,
              source: 'auth/store',
              details: { 
                userId: session.user.id,
                rolesCount: roles.length 
              }
            });
            
            // Publish auth event
            publishAuthEvent({
              type: 'AUTH_SIGNED_IN',
              payload: { user: session.user, session }
            });
          } else {
            set({
              user: null,
              session: null,
              roles: [],
              status: 'unauthenticated' as AuthStatus,
              error: null,
              isAuthenticated: false
            });
            
            logger.info('No user session found', {
              category: LogCategory.AUTH,
              source: 'auth/store'
            });
            
            // Publish auth event
            publishAuthEvent({
              type: 'AUTH_SIGNED_OUT'
            });
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          
          const errorDetails: Record<string, unknown> = { 
            message: errorMessage 
          };
          
          logger.error('Auth initialization error', {
            category: LogCategory.AUTH,
            source: 'auth/store',
            details: errorDetails
          });
          
          set({
            error: errorMessage,
            status: 'unauthenticated' as AuthStatus,
            isAuthenticated: false
          });
          
          // Publish auth error event
          publishAuthEvent({
            type: 'AUTH_ERROR',
            payload: { error: errorMessage }
          });
        } finally {
          set({ 
            isLoading: false,
            initialized: true
          });
          
          // Publish initialization complete event
          publishAuthEvent({
            type: 'AUTH_INITIALIZED'
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
            status: 'unauthenticated' as AuthStatus,
            error: null,
            isAuthenticated: false
          });
          
          // Log successful logout with properly formatted details
          const logDetails: Record<string, unknown> = {
            success: true
          };
          
          logger.info('User logged out successfully', logDetails);
          
          // Publish auth event
          publishAuthEvent({
            type: 'AUTH_SIGNED_OUT'
          });
          
          return true;
        } catch (err) {
          // Format error details correctly
          const errorDetails: Record<string, unknown> = {
            message: err instanceof Error ? err.message : String(err)
          };
          
          logger.error('Error during logout', {
            category: LogCategory.AUTH,
            source: 'auth/store',
            details: errorDetails
          });
          
          set({ error: errorDetails.message as string });
          
          // Publish auth error event
          publishAuthEvent({
            type: 'AUTH_ERROR',
            payload: { error: errorDetails.message }
          });
          
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
        status: state.status
      })
    }
  )
);
