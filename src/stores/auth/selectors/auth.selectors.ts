
import { UserRole } from '@/types/auth.types';
import { AuthState } from '../types/auth.types';

// Selectors for auth state
export const selectUser = (state: AuthState) => state.user;
export const selectSession = (state: AuthState) => state.session;
export const selectStatus = (state: AuthState) => state.status;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectError = (state: AuthState) => state.error;
export const selectInitialized = (state: AuthState) => state.initialized;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectRoles = (state: AuthState) => state.roles;

// Function to check if the user has a specific role
export const hasRole = (role: UserRole | UserRole[]) => {
  return (state: AuthState): boolean => {
    if (!state.roles || !state.roles.length) {
      return false;
    }

    if (Array.isArray(role)) {
      return role.some(r => state.roles.includes(r));
    }

    return state.roles.includes(role);
  };
};

// Check if user is an admin (convenience selector)
export const isAdmin = (state: AuthState): boolean => {
  return state.roles.includes('admin') || state.roles.includes('super_admin');
};

// Check if user is a super admin (highest permission level)
export const isSuperAdmin = (state: AuthState): boolean => {
  return state.roles.includes('super_admin');
};
