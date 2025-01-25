import { useEffect } from "react";
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

  useEffect(() => {
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

  // Don't render anything until we've initialized auth
  if (!initialized || isLoading) {
    return <div>Loading...</div>;
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Don't render if missing required roles
  if (requiredRoles && !requiredRoles.some(role => roles.includes(role))) {
    return null;
  }

  return <>{children}</>;
};