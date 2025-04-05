
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import IndexPage from '@/pages/Index';
import ProfilePage from '@/pages/Profile';
import SettingsPage from '@/pages/Settings';
import NotFoundPage from '@/pages/NotFound';
import LoginPage from '@/pages/Login';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AdminPage from '@/pages/Admin';
import { AdminAuthGuard } from '@/admin/components/AdminAuthGuard';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/login" element={<LoginPage />} />
      
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
      
      {/* Admin Routes */}
      <Route path="/admin/*" element={
        <AdminAuthGuard>
          <AdminPage />
        </AdminAuthGuard>
      }/>
      
      {/* 404 - Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
