
import React from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';
import { AdminRoutes } from '@/admin/routes';

// Main component that holds all routes
const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<div>Home Page</div>} />
      <Route path="/admin/*" element={<AdminRoutes />} />
    </RouterRoutes>
  );
};

export default Routes;
