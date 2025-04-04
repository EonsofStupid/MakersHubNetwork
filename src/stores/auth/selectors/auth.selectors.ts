
import { AuthState } from "../types";
import { AuthStatus } from "@/auth/types/auth.types";

// Select the entire auth state
export const selectAuthState = (state: AuthState) => state;

// Select authentication status
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;

// Select if auth is still loading
export const selectIsAuthLoading = (state: AuthState) => state.isLoading;

// Select if auth is initialized
export const selectIsAuthInitialized = (state: AuthState) => state.initialized;

// Select current auth status
export const selectAuthStatus = (state: AuthState) => state.status;

// Select if auth has an error
export const selectAuthError = (state: AuthState) => state.error;

// Select the user if authenticated
export const selectUser = (state: AuthState) => state.user;

// Select the user's ID
export const selectUserId = (state: AuthState) => state.user?.id;

// Select user roles
export const selectUserRoles = (state: AuthState) => state.roles;

// Check if user has a specific role
export const selectHasRole = (role: string) => (state: AuthState) => 
  state.roles.includes(role as any);

// Check if user is an admin
export const selectIsAdmin = (state: AuthState) =>
  state.roles.some(role => role === 'admin' || role === 'super_admin');
