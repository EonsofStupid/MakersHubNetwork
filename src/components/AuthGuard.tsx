import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth/store";
import { UserRole } from "@/stores/auth/types/auth.types";

interface AuthGuardProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
}

export const AuthGuard = ({ children, requiredRoles }: AuthGuardProps) => {
  const navigate = useNavigate();
  const isLoading = useAuthStore((state) => state.isLoading);
  const status = useAuthStore((state) => state.status);
  const roles = useAuthStore((state) => state.roles);

  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
      return;
    }

    if (
      !isLoading &&
      isAuthenticated &&
      requiredRoles &&
      !requiredRoles.some((r) => roles.includes(r))
    ) {
      navigate("/unauthorized");
    }
  }, [isLoading, isAuthenticated, roles, requiredRoles, navigate]);

  if (isLoading) return <div>Loading guard...</div>;
  if (!isAuthenticated) return null;
  if (requiredRoles && !requiredRoles.some((r) => roles.includes(r))) return null;

  return <>{children}</>;
};