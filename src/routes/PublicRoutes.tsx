
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { PublicHome } from '@/pages/PublicHome';
import { ensureThemeLoaded } from '@/theme/utils/themeLoader';

/**
 * Public routes that don't require authentication
 */
export function PublicRoutes() {
  const logger = useLogger('PublicRoutes', LogCategory.UI);
  
  useEffect(() => {
    // Ensure theme is loaded for public routes
    const loadTheme = async () => {
      try {
        await ensureThemeLoaded('Impulsivity');
        logger.info('Theme loaded for public routes');
      } catch (error) {
        logger.error('Failed to load theme for public routes', { 
          details: { error: String(error) } 
        });
      }
    };
    
    loadTheme();
  }, [logger]);
  
  return (
    <Routes>
      {/* Public home page */}
      <Route path="/" element={
        <DefaultLayout>
          <PublicHome />
        </DefaultLayout>
      } />
      
      {/* Add more public routes here */}
      <Route path="*" element={
        <DefaultLayout>
          <PublicHome />
        </DefaultLayout>
      } />
    </Routes>
  );
}
