
import React from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export const AccessDenied: React.FC = () => {
  const { isAuthenticated, login, logout } = useAuthStore();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
            <ShieldAlert className="h-10 w-10 text-red-500 dark:text-red-400" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {isAuthenticated 
            ? "You don't have permission to access this area." 
            : "You need to sign in to access this area."}
        </p>
        
        <div className="flex flex-col space-y-3">
          {isAuthenticated ? (
            <>
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
              <Button variant="ghost" onClick={() => logout()}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => login('admin@example.com', 'password')}>
                Sign In
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
