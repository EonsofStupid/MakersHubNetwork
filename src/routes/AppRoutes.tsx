
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminRoutes } from '@/admin/routes';
import { PublicRoutes } from '@/routes/PublicRoutes';

export function AppRoutes() {
  return (
    <Routes>
      {/* Admin routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      
      {/* Public routes */}
      <Route path="/*" element={<PublicRoutes />} />
    </Routes>
  );
}

export default AppRoutes;
