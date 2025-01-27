import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth/store";
import {
  selectUser,
  selectSession,
  selectRoles,
  selectIsLoading,
  selectError,
  selectIsAuthenticated,
  selectIsAdmin,
} from "@/stores/auth/selectors/auth.selectors";

export const useAuth = () => {
  const user = useAuthStore(selectUser);
  const session = useAuthStore(selectSession);
  const roles = useAuthStore(selectRoles);
  const isLoading = useAuthStore(selectIsLoading);
  const error = useAuthStore(selectError);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isAdmin = useAuthStore(selectIsAdmin);
  const { hasRole, logout } = useAuthStore();

  // Debug auth state changes in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth state updated:', {
        user: user?.id,
        isAuthenticated,
        roles,
        status: session ? 'authenticated' : 'unauthenticated'
      });
    }
  }, [user, isAuthenticated, roles, session]);

  return {
    user,
    session,
    roles,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    hasRole,
    logout,
  };
};