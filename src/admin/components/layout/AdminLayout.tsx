
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AdminNavbar } from './AdminNavbar';
import { AdminSidebar } from './AdminSidebar';
import { useAuth } from '@/auth/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useThemeLoader } from '@/admin/theme/useThemeLoader';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';

export function AdminLayout() {
  const { user, isLoading: authLoading } = useAuth();
  const { isLoaded: themeLoaded } = useThemeLoader();
  const logger = useLogger('AdminLayout', { category: LogCategory.ADMIN as string });

  useEffect(() => {
    logger.info('Admin layout mounted');
    
    // Add admin-specific body classes
    document.body.classList.add('admin-panel');
    
    return () => {
      // Clean up when component unmounts
      document.body.classList.remove('admin-panel');
    };
  }, [logger]);

  // Show loading if auth or theme is still loading
  if (authLoading || !themeLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminNavbar />
      
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}
