
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/auth/hooks/useAuth";
import { LoadingScreen } from "@/components/ui/loading-screen";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute = ({ 
  children, 
  requiredRoles 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, roles } = useAuth();
  
  // Show loading screen while auth state is being determined
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If there are required roles, check if user has at least one of them
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => 
      roles.includes(role as any)
    );
    
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }
  
  // User is authenticated and has required roles if any
  return <>{children}</>;
};
