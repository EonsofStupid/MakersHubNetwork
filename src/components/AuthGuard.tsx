import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/stores/auth/types/auth.types";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

export const AuthGuard = ({ children, requiredRoles }: AuthGuardProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, roles, initialized } = useAuth();

  const checkAuth = useCallback(() => {
    if (!initialized) return;

    if (!isLoading && !isAuthenticated) {
      navigate("/login");
      return;
    }

    if (
      !isLoading &&
      isAuthenticated &&
      requiredRoles &&
      !requiredRoles.some(role => roles.includes(role))
    ) {
      navigate("/unauthorized");
    }
  }, [isAuthenticated, isLoading, navigate, requiredRoles, roles, initialized]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!initialized || isLoading) {
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