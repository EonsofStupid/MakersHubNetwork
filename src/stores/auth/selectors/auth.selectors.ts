import { AuthStore } from "../types/auth.types";

export const selectUser = (state: AuthStore) => state.user;
export const selectSession = (state: AuthStore) => state.session;
export const selectRoles = (state: AuthStore) => state.roles;
export const selectIsLoading = (state: AuthStore) => state.isLoading;
export const selectError = (state: AuthStore) => state.error;
export const selectIsInitialized = (state: AuthStore) => state.initialized;
export const selectIsAuthenticated = (state: AuthStore) => !!state.user;
export const selectHasRole = (role: string) => (state: AuthStore) => 
  state.roles.includes(role as any);
export const selectIsAdmin = (state: AuthStore) => 
  state.roles.includes('admin');