
import React from 'react';
import { ShieldX } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useNavigate } from 'react-router-dom';

export const AccessDenied: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center max-w-md p-6 text-center">
        <ShieldX className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold tracking-tight">Access Denied</h1>
        <p className="mt-4 text-muted-foreground">
          You don't have permission to access this section. Please contact an administrator if you believe this is an error.
        </p>
        <div className="mt-6 flex gap-4">
          <Button onClick={() => navigate('/')}>
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};
