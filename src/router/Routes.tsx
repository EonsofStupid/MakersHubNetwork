
import React from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';
import { AdminAuthGuard } from '@/admin/panels/auth/AdminAuthGuard';
import { AccessDenied } from '@/admin/panels/auth/AccessDenied';
import LoginPage from '@/app/auth/LoginPage';
import AdminDashboard from '@/admin/pages/Dashboard';
import { useAuthStore } from '@/auth/store/auth.store';
import { AuthStatus, ROLES } from '@/shared/types/shared.types';

const HomePage = () => (
  <div className="container mx-auto p-6">
    <h1 className="text-3xl font-bold mb-6">Welcome to Admin Dashboard System</h1>
    <p className="mb-4">This is a role-based access control system demonstration.</p>
    <p className="text-muted-foreground">
      To access the admin dashboard, please login with the following credentials:
    </p>
    <ul className="list-disc pl-6 mt-2 mb-4">
      <li>Admin access: admin@example.com / admin123</li>
      <li>Super admin access: superadmin@example.com / super123</li>
    </ul>
  </div>
);

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
  if (status === AuthStatus.LOADING) {
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
