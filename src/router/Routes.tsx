
import React from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';
import { AdminAuthGuard } from '@/admin/panels/auth/AdminAuthGuard';
import { AccessDenied } from '@/admin/panels/auth/AccessDenied';
import HomePage from '@/app/pages/HomePage';
import LoginPage from '@/app/auth/LoginPage';
import AdminDashboard from '@/admin/pages/Dashboard';
import { useAuthStore } from '@/auth/store/auth.store';
import { AUTH_STATUS, ROLES } from '@/shared/types/shared.types';

// Loading component for auth state
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Main component that holds all routes
const Routes = () => {
  const { status } = useAuthStore();
  
  // Show loading screen while auth is initializing
  if (status === AUTH_STATUS.LOADING) {
    return <LoadingScreen />;
  }
  
  return (
    <RouterRoutes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<LoginPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <AdminAuthGuard requiredRole={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
          <AdminDashboard />
        </AdminAuthGuard>
      } />
      
      {/* Access Denied Route */}
      <Route path="/admin/unauthorized" element={<AccessDenied />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<div>Page not found</div>} />
    </RouterRoutes>
  );
};

export default Routes;
