
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from '@/auth/hooks/useAuth';
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register';
import ResetPasswordPage from '@/pages/ResetPassword';
import LinkAccountPage from '@/pages/LinkAccount';
import { Navigate } from 'react-router-dom';

export function AuthRoutes() {
  const { isAuthenticated } = useAuth();
  
  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/link-account" element={<LinkAccountPage />} />
    </Routes>
  );
}

export default AuthRoutes;
