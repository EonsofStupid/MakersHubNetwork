
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import IndexPage from '@/pages/Index';
import ProfilePage from '@/pages/Profile';
import SettingsPage from '@/pages/Settings';
import NotFoundPage from '@/pages/NotFound';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      
      {/* Protected Routes */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      } />
      
      {/* 404 - Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
