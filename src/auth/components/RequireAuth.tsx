
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/auth/store/auth.store';

interface RequireAuthProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function RequireAuth({ children, redirectTo = '/login' }: RequireAuthProps) {
  const location = useLocation();
  const { status, isAuthenticated } = useAuthStore();
  
  // If authentication status is still loading, show a loading state
  if (status === 'LOADING') {
    return <div>Loading authentication status...</div>;
  }
  
  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  // If authenticated, render children
  return <>{children}</>;
}
