
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, AuthActions, AuthStatus, UserRole } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { authStorage } from './middleware/persist.middleware';
import { publishAuthEvent } from '../bridge';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';

// Initial state
const initialState: AuthState = {
  user: null,
  session: null,
  roles: [],
  isLoading: false,
  error: null,
  status: 'idle',
  initialized: false,
  isAuthenticated: false
};

// Create store with persist middleware
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Actions
      setUser: (user) => {
        set({ 
          user,
          isAuthenticated: !!user
        });
        
        if (user) {
          publishAuthEvent('login', { user });
        } else {
          publishAuthEvent('logout');
        }
      },
      
      setSession: (session) => {
        set({ 
          session,
          isAuthenticated: !!session
        });
      },
      
      setRoles: (roles) => {
        set({ roles });
        publishAuthEvent('roleChange', { roles });
      },
      
      setError: (error) => {
        set({ error });
        if (error) {
          publishAuthEvent('error', { error });
        }
      },
      
      setLoading: (isLoading) => {
        set({ isLoading });
      },
      
      setInitialized: (initialized) => {
        set({ initialized });
        if (initialized) {
          publishAuthEvent('initialized');
        }
      },
      
      setStatus: (status) => {
        set({ status });
      },
      
      hasRole: (role) => {
        return get().roles.includes(role);
      },
      
      isAdmin: () => {
        return get().roles.includes('admin' as UserRole) || 
               get().roles.includes('super_admin' as UserRole);
      },
      
      // Initialize auth state
      initialize: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Get current session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            set({ 
              error: sessionError.message,
              status: 'unauthenticated',
              isLoading: false,
              initialized: true,
              isAuthenticated: false
            });
            return;
          }
          
          // If we have a session, set user and fetch roles
          if (session) {
            set({ 
              user: session.user,
              session,
              status: 'authenticated',
              isAuthenticated: true
            });
            
            // Fetch user roles
            try {
              const { data: userRoles, error: rolesError } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', session.user.id);
                
              if (rolesError) {
                console.error('Error fetching roles:', rolesError);
              } else if (userRoles) {
                const roles = userRoles.map((r) => r.role as UserRole);
                set({ roles });
              }
            } catch (error) {
              console.error('Error in roles query:', error);
              // Don't fail initialization if roles fetch fails
            }
          } else {
            set({ 
              user: null,
              session: null,
              roles: [],
              status: 'unauthenticated',
              isAuthenticated: false
            });
          }
          
          // Setup auth state change listener
          const { data: { subscription } } = await supabase.auth.onAuthStateChange(
            async (event, session) => {
              if (event === 'SIGNED_IN' && session) {
                set({ 
                  user: session.user,
                  session,
                  status: 'authenticated',
                  isAuthenticated: true 
                });
                
                // Fetch roles when signed in
                try {
                  const { data: userRoles } = await supabase
                    .from('user_roles')
                    .select('role')
                    .eq('user_id', session.user.id);
                    
                  if (userRoles) {
                    const roles = userRoles.map((r) => r.role as UserRole);
                    set({ roles });
                  }
                } catch (error) {
                  console.error('Error fetching roles:', error);
                }
                
                publishAuthEvent('login', { user: session.user });
              } else if (event === 'SIGNED_OUT') {
                set({ 
                  user: null,
                  session: null,
                  roles: [],
                  status: 'unauthenticated',
                  isAuthenticated: false
                });
                publishAuthEvent('logout');
              }
            }
          );
          
          // Store subscription for cleanup
          set({ 
            isLoading: false, 
            initialized: true,
            // Store subscription reference for cleanup if needed
            // @ts-ignore - We're adding a non-typed field, but it's fine for internal use
            _subscription: subscription
          });
          
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown authentication error';
          set({ 
            error: errorMessage,
            status: 'unauthenticated',
            isLoading: false,
            initialized: true,
            isAuthenticated: false
          });
          publishAuthEvent('error', { error: errorMessage });
        }
      },
      
      // Logout
      logout: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const { error } = await supabase.auth.signOut();
          
          if (error) {
            set({ 
              error: error.message,
              isLoading: false
            });
            return;
          }
          
          // Reset state
          set({ 
            ...initialState,
            initialized: true,
            status: 'unauthenticated',
            isLoading: false
          });
          
          publishAuthEvent('logout');
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error during logout';
          set({ 
            error: errorMessage,
            isLoading: false
          });
          publishAuthEvent('error', { error: errorMessage });
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => authStorage)
    }
  )
);

// Export types for components
export { type AuthStatus } from '@/types/auth';
