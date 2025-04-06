
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminRoutes } from '@/admin/routes';

export function AppRoutes() {
  return (
    <Routes>
      {/* Admin routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      
      {/* You can add more routes here for non-admin pages */}
      <Route path="/*" element={<AdminRoutes />} />
    </Routes>
  );
}

export default AppRoutes;
