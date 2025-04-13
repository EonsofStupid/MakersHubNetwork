
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminOverlay from '../debug/AdminOverlay';
import { AdminOverlayToggleButton } from '../debug/AdminOverlayToggleButton';
import { useHasRole } from '@/auth/hooks/useHasRole';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';
import { useToast } from '@/shared/hooks/use-toast';

export function AdminLayout() {
  const { hasAdminAccess } = useHasRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const logger = useLogger('AdminLayout', LogCategory.ADMIN);
  
  // Check if user has admin access
  useEffect(() => {
    const checkAccess = async () => {
      if (!hasAdminAccess()) {
        logger.warn('Unauthorized access attempt to admin area');
        toast({
          title: 'Access Denied',
          description: 'You don\'t have permission to access the admin area',
          variant: 'destructive'
        });
        navigate('/');
      } else {
        logger.info('Admin access granted');
      }
    };
    
    checkAccess();
  }, [hasAdminAccess, navigate, toast, logger]);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="h-14 border-b border-border/40 flex items-center justify-between px-4">
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        
        <div className="flex items-center gap-2">
          <AdminOverlayToggleButton />
        </div>
      </header>
      
      {/* Admin Content */}
      <main className="p-4">
        <Outlet />
      </main>
      
      {/* Debug Overlay */}
      <AdminOverlay />
    </div>
  );
}
