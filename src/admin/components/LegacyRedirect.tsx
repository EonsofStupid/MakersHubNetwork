
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { convertLegacyTabToPath } from '@/admin/utils/routeUtils';
import { useRouterBridge } from '@/components/routing/RouterBridge';

export const LegacyRedirect: React.FC = () => {
  const location = useLocation();
  const { navigateTo } = useRouterBridge();
  
  useEffect(() => {
    // Extract tab from query parameters
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab') || 'overview';
    
    // Redirect to the new path
    const newPath = convertLegacyTabToPath(tab);
    navigateTo(newPath);
  }, [location.search, navigateTo]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
        <p className="text-muted-foreground">Redirecting to new admin interface...</p>
      </div>
    </div>
  );
};
