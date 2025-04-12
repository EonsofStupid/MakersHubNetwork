
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminOverlay from '../debug/AdminOverlay';
import { AdminOverlayToggleButton } from '../debug/AdminOverlayToggleButton';
import { useHasRole } from '@/auth/hooks/useHasRole';
import { useNavigate } from 'react-router-dom';

export function AdminLayout() {
  const { hasAdminAccess } = useHasRole();
  const navigate = useNavigate();
  
  // Check if user has admin access
  useEffect(() => {
    const checkAccess = async () => {
      const hasAccess = await hasAdminAccess();
      if (!hasAccess) {
        navigate('/unauthorized');
      }
    };
    
    checkAccess();
  }, [hasAdminAccess, navigate]);
  
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
