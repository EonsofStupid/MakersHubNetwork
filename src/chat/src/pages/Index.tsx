
import React from 'react';
import { Button } from '@/shared/ui/button';
import { authBridge } from '@/auth/bridge';
import { useState } from 'react';

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const auth = {
    user: null,
    status: {
      isAuthenticated: false,
      isLoading: false,
    },
    signIn: async () => null,
    signInWithGoogle: async () => null,
    logout: async () => {},
    hasRole: () => false,
    isAdmin: () => false,
    isSuperAdmin: () => false,
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await authBridge.signIn('test@example.com', 'password123');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Chat Application</h1>
      
      <div className="flex flex-col space-y-4">
        <Button
          onClick={handleLogin}
          disabled={isLoading || auth.status.isAuthenticated}
        >
          {isLoading ? 'Logging in...' : auth.status.isAuthenticated ? 'Logged In' : 'Login'}
        </Button>
      </div>
    </div>
  );
}
