
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/auth/store/auth.store';
import { Button } from '@/shared/ui/button';
import { AlertCircle } from 'lucide-react';

export const AccessDenied: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-lg text-center">
        <div className="flex justify-center">
          <AlertCircle className="h-16 w-16 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mt-4 mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          {isAuthenticated
            ? "You don't have permission to access this area. Please contact an administrator."
            : "You need to be logged in to access this area."}
        </p>
        <div className="flex flex-col space-y-3">
          {!isAuthenticated && (
            <Button onClick={() => navigate('/auth')}>
              Login
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};
