
import React from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';
import { AdminAuthGuard } from '@/admin/panels/auth/AdminAuthGuard';
import { AccessDenied } from '@/admin/panels/auth/AccessDenied';
import LoginPage from '@/app/auth/LoginPage';
import AdminDashboard from '@/admin/pages/Dashboard';
import HomePage from '@/pages/HomePage';
import { useAuthStore } from '@/auth/store/auth.store';
import { AUTH_STATUS, ROLES } from '@/shared/types/shared.types';

const Routes = () => {
  const { status } = useAuthStore();
  
  if (status === AUTH_STATUS.LOADING) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <RouterRoutes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<LoginPage />} />
      <Route path="/features" element={<HomePage />} />
      <Route path="/about" element={<div className="container mx-auto p-6">About Page</div>} />
      <Route path="/community" element={<div className="container mx-auto p-6">Community Page</div>} />
      <Route path="/firmware" element={<div className="container mx-auto p-6">Firmware Page</div>} />
      <Route path="/parts" element={<div className="container mx-auto p-6">Parts Marketplace</div>} />
      <Route path="/troubleshooting" element={<div className="container mx-auto p-6">Troubleshooting Page</div>} />
      <Route path="/guides" element={<div className="container mx-auto p-6">Build Guides Page</div>} />
      
      <Route path="/admin" element={
        <AdminAuthGuard requiredRole={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
          <AdminDashboard />
        </AdminAuthGuard>
      } />
      
      <Route path="/admin/unauthorized" element={<AccessDenied />} />
      
      <Route path="*" element={<div>Page not found</div>} />
    </RouterRoutes>
  );
};

export default Routes;
