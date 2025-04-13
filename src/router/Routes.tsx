
import React from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';
import { AdminAuthGuard } from '@/admin/panels/auth/AdminAuthGuard';
import LoginPage from '@/app/auth/LoginPage';
import AdminDashboard from '@/admin/pages/Dashboard';

// Main component that holds all routes
const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<div>Home Page</div>} />
      <Route path="/auth" element={<LoginPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <AdminAuthGuard>
          <AdminDashboard />
        </AdminAuthGuard>
      } />
    </RouterRoutes>
  );
};

export default Routes;
