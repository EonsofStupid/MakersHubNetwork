
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth/store';
import { useToast } from '@/hooks/use-toast';

export default function Logout() {
  const logout = useAuthStore((state) => state.logout);
  const { toast } = useToast();
  
  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        toast({
          title: "Logged out",
          description: "You have been successfully logged out",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "There was a problem logging out",
          variant: "destructive",
        });
      }
    };
    
    performLogout();
  }, [logout, toast]);
  
  return <Navigate to="/" replace />;
}
