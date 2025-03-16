
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { convertLegacyTabToPath } from '@/admin/utils/routeUtils';
import { Loader2 } from 'lucide-react';

export const LegacyRedirect: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Extract tab from query parameters
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab') || 'overview';
    
    // Redirect to the new path
    const newPath = convertLegacyTabToPath(tab);
    console.log(`LegacyRedirect: Redirecting from ${location.pathname}${location.search} to ${newPath}`);
    
    // Use direct navigation for better reliability
    const redirectTimer = setTimeout(() => {
      navigate(newPath, { replace: true });
    }, 100);
    
    return () => clearTimeout(redirectTimer);
  }, [location.search, navigate, location.pathname]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 text-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
        <p className="text-muted-foreground">Redirecting to admin interface...</p>
      </div>
    </div>
  );
};

export default LegacyRedirect;
