
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { Shield } from 'lucide-react';

export function AccessDenied() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] p-4 text-center">
      <Shield size={64} className="text-destructive mb-6" />
      <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
      <p className="text-muted-foreground mb-6">
        You don't have permission to access this area.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => navigate('/')} variant="outline">
          Return to Home
        </Button>
        <Button onClick={() => navigate('/auth')}>
          Sign In with Different Account
        </Button>
      </div>
    </div>
  );
}
