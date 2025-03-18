
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { convertLegacyTabToPath } from '@/admin/utils/routeUtils';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const LegacyRedirect: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    
    const handleRedirect = () => {
      try {
        // Extract tab from query parameters
        const searchParams = new URLSearchParams(location.search);
        const tab = searchParams.get('tab') || 'overview';
        
        // Redirect to the new path
        const newPath = convertLegacyTabToPath(tab);
        console.log(`LegacyRedirect: Redirecting from ${location.pathname}${location.search} to ${newPath}`);
        
        // Use a short timeout to ensure the redirect happens properly
        const redirectTimer = setTimeout(() => {
          if (isMounted) {
            navigate(newPath, { replace: true });
          }
        }, 100);
        
        return () => clearTimeout(redirectTimer);
      } catch (error) {
        console.error("Legacy redirect error:", error);
        if (isMounted) {
          setError(error instanceof Error ? error : new Error("Failed to redirect"));
          
          toast({
            variant: "destructive",
            title: "Navigation Error",
            description: "There was an error redirecting to the admin section"
          });
        }
      }
    };
    
    handleRedirect();
    
    return () => {
      isMounted = false;
    };
  }, [location.search, navigate, location.pathname, toast]);
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="p-6 max-w-md text-center space-y-4 bg-destructive/5 border border-destructive/20 rounded-lg">
          <h2 className="text-lg font-medium text-destructive">Navigation Error</h2>
          <p className="text-muted-foreground">{error.message}</p>
          <button 
            onClick={() => navigate("/admin/overview", { replace: true })}
            className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
          >
            Go to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 text-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
        <p className="text-muted-foreground">Redirecting to admin interface...</p>
      </div>
    </div>
  );
};
