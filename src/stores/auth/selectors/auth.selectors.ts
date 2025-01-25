import { AuthStore } from "../types/auth.types";

// Core State Selectors
export const selectUser = (state: AuthStore) => state.user;
export const selectSession = (state: AuthStore) => state.session;
export const selectRoles = (state: AuthStore) => state.roles;
export const selectStatus = (state: AuthStore) => state.status;
export const selectError = (state: AuthStore) => state.error;
export const selectIsLoading = (state: AuthStore) => state.isLoading;

// Derived Selectors
export const selectIsAuthenticated = (state: AuthStore) => 
  state.status === 'authenticated';

export const selectIsAdmin = (state: AuthStore) => 
  state.roles.includes('admin');

export const selectHasRole = (role: string) => (state: AuthStore) => 
  state.roles.includes(role as any);

// Debug Selectors (development only)
export const selectAuthDebugState = (state: AuthStore) => ({
  userId: state.user?.id,
  status: state.status,
  roles: state.roles,
  isLoading: state.isLoading,
  error: state.error
});