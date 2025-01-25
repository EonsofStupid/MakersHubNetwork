import { useAuthStore } from "@/stores/auth/store";
import { 
  selectUser,
  selectSession,
  selectIsAuthenticated,
  selectRoles,
  selectIsLoading,
  selectError,
  selectIsAdmin,
  selectHasRole
} from "@/stores/auth/selectors/auth.selectors";

export const useAuth = () => {
  const user = useAuthStore(selectUser);
  const session = useAuthStore(selectSession);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const roles = useAuthStore(selectRoles);
  const isLoading = useAuthStore(selectIsLoading);
  const error = useAuthStore(selectError);
  const isAdmin = useAuthStore(selectIsAdmin);
  const hasRole = useAuthStore(state => state.hasRole);

  // Actions
  const { setUser, setSession, logout } = useAuthStore();

  return {
    // State
    user,
    session,
    isAuthenticated,
    roles,
    isLoading,
    error,
    isAdmin,
    hasRole,
    // Actions
    setUser,
    setSession,
    logout
  };
};