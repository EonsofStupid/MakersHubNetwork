
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/shared/types/shared.types';
import { Button } from '@/shared/ui/button';

interface AccessDeniedProps {
  requiredRole?: UserRole | UserRole[];
}

export function AccessDenied({ requiredRole }: AccessDeniedProps) {
  const navigate = useNavigate();
  
  const roleDisplay = () => {
    if (!requiredRole) return '';
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.join(' or ');
    }
    
    return requiredRole;
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <div className="bg-destructive/10 p-6 rounded-lg border border-destructive/30 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
        <p className="mb-4 text-muted-foreground">
          You don't have permission to access this area.
          {requiredRole && (
            <span className="block mt-2">
              Required role: <strong>{roleDisplay()}</strong>
            </span>
          )}
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            Go Home
          </Button>
          <Button
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
