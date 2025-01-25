import { useAuthStore } from "@/stores/auth/store";
import { 
  selectUser,
  selectSession,
  selectIsAuthenticated,
  selectRoles,
  selectIsLoading,
  selectError,
  selectIsAdmin,
  selectIsSuperAdmin,
  selectIsEditor,
  selectHasRole,
  selectUserDisplayName,
  selectAuthStatus,
  selectInitialized
} from "@/stores/auth/selectors/auth.selectors";

export const useAuth = () => {
  const user = useAuthStore(selectUser);
  const session = useAuthStore(selectSession);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const roles = useAuthStore(selectRoles);
  const isLoading = useAuthStore(selectIsLoading);
  const error = useAuthStore(selectError);
  const isAdmin = useAuthStore(selectIsAdmin);
  const isSuperAdmin = useAuthStore(selectIsSuperAdmin);
  const isEditor = useAuthStore(selectIsEditor);
  const hasRole = useAuthStore(state => state.hasRole);
  const displayName = useAuthStore(selectUserDisplayName);
  const authStatus = useAuthStore(selectAuthStatus);
  const initialized = useAuthStore(selectInitialized);

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
    isSuperAdmin,
    isEditor,
    hasRole,
    displayName,
    authStatus,
    initialized,
    // Actions
    setUser,
    setSession,
    logout
  };
};