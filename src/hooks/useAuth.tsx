// useAuth.ts
import { useAuthStore } from "@/stores/auth/store";
import { selectUser, selectSession, selectIsAuthenticated } from "@/stores/auth/selectors";

export const useAuth = () => {
  const user = useAuthStore(selectUser);
  const session = useAuthStore(selectSession);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  // Additional store data or actions:
  const { setUser, setSession, logout } = useAuthStore();

  return {
    user,
    session,
    isAuthenticated,
    setUser,
    setSession,
    logout
  };
};
