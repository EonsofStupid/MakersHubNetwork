
import React from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';
import HomePage from '@/app/home/HomePage';
import LoginPage from '@/app/auth/LoginPage';
import AdminDashboard from '@/admin/pages/Dashboard';

// Main component that holds all routes
const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<LoginPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/posts/:slug" element={<div>Post Detail Page</div>} />
      <Route path="/blog" element={<div>Blog Listing Page</div>} />
      <Route path="/category/:slug" element={<div>Category Page</div>} />
      <Route path="*" element={<div>Page not found</div>} />
    </RouterRoutes>
  );
};

export default Routes;
