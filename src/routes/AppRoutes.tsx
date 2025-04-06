
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminRoutes } from '@/admin/routes';
import { PublicRoutes } from '@/routes/PublicRoutes';

export function AppRoutes() {
  return (
    <Routes>
      {/* Admin routes - require authentication */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      
      {/* Public routes - accessible without authentication */}
      <Route path="/*" element={<PublicRoutes />} />
    </Routes>
  );
}

export default AppRoutes;
