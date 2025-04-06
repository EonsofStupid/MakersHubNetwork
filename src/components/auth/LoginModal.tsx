
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

export interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
      onOpenChange(false);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button onClick={handleLogin}>
            Login with Provider
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
