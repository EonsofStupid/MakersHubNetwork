
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { useRouteCircuitBreaker } from '@/hooks/useRouteCircuitBreaker';

export function AppRouter() {
  // Use the route circuit breaker to reset circuit breakers on route changes
  useRouteCircuitBreaker();
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      
      {/* Add all your routes above this line */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
