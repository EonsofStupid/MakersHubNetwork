
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthStore, UserRole, AuthStatus } from '@/types/auth.unified';
import { supabase } from '@/integrations/supabase/client';
import { authStorage } from '@/auth/store/middleware/persist.middleware';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

const initialState = {
  user: null,
  session: null,
  roles: [],
  isLoading: true,
  error: null,
  status: 'idle' as AuthStatus,
  initialized: false,
  isAuthenticated: false,
};

// Create a compatible storage object for Zustand persist middleware
const createCompatibleStorage = () => ({
  getItem: (name: string) => {
    const value = authStorage.getItem(name);
    if (value === null) return null;
    return Promise.resolve(JSON.parse(value));
  },
  setItem: (name: string, value: unknown) => {
    authStorage.setItem(name, JSON.stringify(value));
    return Promise.resolve();
  },
  removeItem: (name: string) => {
    authStorage.removeItem(name);
    return Promise.resolve();
  },
});

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Methods
      setUser: (user) => set({ 
        user,
        isAuthenticated: !!user
      }),
      
      setSession: (session) => set({ 
        session,
        user: session?.user ?? null,
        status: session ? 'authenticated' : 'unauthenticated',
        isAuthenticated: !!session
      }),
      
      setRoles: (roles) => set({ roles }),
      
      setError: (error) => set({ error }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setInitialized: (initialized) => set({ initialized }),
      
      setStatus: (status) => set(state => ({ 
        status,
        isAuthenticated: status === 'authenticated' 
      })),
      
      // Role checking
      hasRole: (role) => get().roles.includes(role),
      
      isAdmin: () => get().roles.includes('admin' as UserRole) || 
                    get().roles.includes('super_admin' as UserRole),
      
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
              status: 'authenticated',
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
          } else {
            set({
              user: null,
              session: null,
              roles: [],
              status: 'unauthenticated',
              error: null,
              isAuthenticated: false
            });
            
            logger.info('No user session found', {
              category: LogCategory.AUTH,
              source: 'auth/store'
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          const errorDetails = {
            message: errorMessage,
            details: error instanceof Error ? { ...error } : undefined
          };
          
          logger.error("Error initializing auth", { 
            details: errorDetails
          });
          
          set({
            error: errorMessage,
            status: 'unauthenticated',
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
            status: 'unauthenticated',
            error: null,
            isAuthenticated: false
          });
          
          logger.info('User logged out successfully', {
            category: LogCategory.AUTH,
            source: 'auth/store'
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          const errorDetails = {
            message: errorMessage,
            details: error instanceof Error ? { ...error } : undefined
          };
          
          logger.warn("Error during logout", { 
            details: errorDetails
          });
          
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createCompatibleStorage(),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        roles: state.roles,
        status: state.status,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,
        initialized: state.initialized
      })
    }
  )
);
