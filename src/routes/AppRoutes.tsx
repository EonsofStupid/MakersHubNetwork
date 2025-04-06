
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminRoutes } from '@/admin/routes';
import { PublicRoutes } from './PublicRoutes';

export function AppRoutes() {
  return (
    <Routes>
      {/* Admin routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      
      {/* Public routes for non-admin pages */}
      <Route path="/*" element={<PublicRoutes />} />
    </Routes>
  );
}

export default AppRoutes;
