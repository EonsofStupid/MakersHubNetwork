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