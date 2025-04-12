
import React from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';
import { PlaceholderPage } from '@/admin/routes/PlaceholderPage';

// Main component that holds all routes
const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<div>Home Page</div>} />
      <Route path="/admin" element={
        <PlaceholderPage 
          title="Admin Dashboard" 
          description="Welcome to the admin dashboard, where you can manage your application." 
          requiredPermission="admin.access"
        />
      } />
    </RouterRoutes>
  );
};

export default Routes;
