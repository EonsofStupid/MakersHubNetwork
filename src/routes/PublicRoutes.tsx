
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/components/layouts/PublicLayout';

// Import public pages (lazy load them for better performance)
const Login = React.lazy(() => import('@/pages/Login'));
const Home = React.lazy(() => import('@/pages/Home'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

export function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        {/* Home page */}
        <Route 
          index 
          element={
            <Suspense fallback={<PageLoader />}>
              <Home />
            </Suspense>
          } 
        />

        {/* Login page */}
        <Route 
          path="login" 
          element={
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          } 
        />
        
        {/* 404 page */}
        <Route 
          path="*" 
          element={
            <Suspense fallback={<PageLoader />}>
              <NotFound />
            </Suspense>
          } 
        />
      </Route>
    </Routes>
  );
}

export default PublicRoutes;
