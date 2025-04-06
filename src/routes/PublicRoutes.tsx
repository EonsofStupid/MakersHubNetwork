
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useAdminAccess } from '@/admin/hooks/useAdminAccess';
import { MainNav } from '@/components/MainNav';
import Login from '@/pages/Login';
import LandingPage from '@/pages/Landing';
import Footer from '@/components/Footer';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

/**
 * Public routes that don't require authentication
 * These routes will load the theme immediately without auth checks
 */
export function PublicRoutes() {
  const { isAuthenticated } = useAuth();
  const { hasAdminAccess } = useAdminAccess();
  const logger = useLogger('PublicRoutes', LogCategory.SYSTEM);
  
  logger.info('PublicRoutes rendering', {
    details: { isAuthenticated, hasAdminAccess }
  });
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Navigation - available for all users */}
      <MainNav />
      
      {/* Public content area */}
      <div className="flex-grow">
        <Routes>
          {/* Login Page */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
          />
          
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Add more public routes here */}
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      
      {/* Footer - available for all users */}
      <Footer />
    </div>
  );
}
