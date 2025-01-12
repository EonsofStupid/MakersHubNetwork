import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/stores/auth/types/auth.types";
import {
  selectUser,
  selectSession,
  selectRoles,
  selectIsLoading,
  selectError,
  selectIsAuthenticated,
} from "@/stores/auth/selectors/auth.selectors";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

export const AuthGuard = ({ children, requiredRoles }: AuthGuardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, roles } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }

    if (
      !isLoading &&
      isAuthenticated &&
      requiredRoles &&
      !requiredRoles.some(role => roles.includes(role))
    ) {
      navigate("/unauthorized");
    }
  }, [isAuthenticated, isLoading, navigate, requiredRoles, roles]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRoles && !requiredRoles.some(role => roles.includes(role))) {
    return null;
  }

  return <>{children}</>;
};