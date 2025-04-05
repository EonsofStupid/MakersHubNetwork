
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute = ({ 
  children, 
  requiredRoles 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, roles } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={`/login?from=${encodeURIComponent(location.pathname)}`} replace />;
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
