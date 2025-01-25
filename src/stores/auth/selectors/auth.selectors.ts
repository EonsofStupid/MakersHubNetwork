import { AuthStore } from "../types/auth.types";

// Core State Selectors
export const selectUser = (state: AuthStore) => state.user;
export const selectSession = (state: AuthStore) => state.session;
export const selectRoles = (state: AuthStore) => state.roles;
export const selectStatus = (state: AuthStore) => state.status;
export const selectError = (state: AuthStore) => state.error;
export const selectIsLoading = (state: AuthStore) => state.isLoading;
export const selectInitialized = (state: AuthStore) => state.initialized;

// Derived Selectors
export const selectIsAuthenticated = (state: AuthStore) => 
  state.status === 'authenticated';

export const selectIsAdmin = (state: AuthStore) => 
  state.roles.includes('admin');

export const selectIsSuperAdmin = (state: AuthStore) => 
  state.roles.includes('super_admin');

export const selectIsEditor = (state: AuthStore) => 
  state.roles.includes('editor');

export const selectHasRole = (role: string) => (state: AuthStore) => 
  state.roles.includes(role as any);

export const selectUserDisplayName = (state: AuthStore) => 
  state.user?.user_metadata?.full_name || 
  state.user?.email?.split('@')[0] || 
  'Anonymous User';

export const selectAuthStatus = (state: AuthStore) => ({
  isAuthenticated: state.status === 'authenticated',
  isLoading: state.isLoading,
  isInitialized: state.initialized,
  hasError: !!state.error
});

// Debug Selectors (development only)
export const selectAuthDebugState = (state: AuthStore) => ({
  userId: state.user?.id,
  email: state.user?.email,
  status: state.status,
  roles: state.roles,
  isLoading: state.isLoading,
  error: state.error,
  sessionExpiry: state.session?.expires_at,
  lastUpdated: new Date().toISOString()
});

// Performance Monitoring Selectors
export const selectAuthPerformance = (state: AuthStore) => ({
  initialized: state.initialized,
  loadingState: state.isLoading,
  hasSession: !!state.session,
  hasUser: !!state.user,
  hasRoles: state.roles.length > 0,
  timestamp: Date.now()
});