
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "../hooks/useAuthState";
import { canAccessAdmin } from "../rbac/enforce";

/**
 * Redirect to login if the user is not authenticated
 */
export const useRedirectUnauthenticated = (
  redirectTo: string = "/login",
  message: string = "Please log in to access this page"
) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuthState();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: message,
        variant: "destructive",
      });
      navigate(redirectTo);
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo, toast, message]);

  return { isLoading, isAuthenticated };
};

/**
 * Redirect if the user is not an admin
 */
export const useRedirectNonAdmin = (
  redirectTo: string = "/",
  message: string = "You do not have permission to access this page"
) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { roles, isAuthenticated, isLoading } = useAuthState();
  const hasAccess = canAccessAdmin(roles);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasAccess) {
      toast({
        title: "Access Denied",
        description: message,
        variant: "destructive",
      });
      navigate(redirectTo);
    }
  }, [hasAccess, isAuthenticated, isLoading, navigate, redirectTo, toast, message]);

  return { isLoading, isAuthenticated, hasAccess };
};

/**
 * Redirect authenticated users (e.g., away from login page)
 */
export const useRedirectAuthenticated = (
  redirectTo: string = "/"
) => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthState();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  return { isLoading, isAuthenticated };
};
