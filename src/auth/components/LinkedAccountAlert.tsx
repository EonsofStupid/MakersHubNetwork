
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Check } from 'lucide-react';
import { authBridge } from '@/bridges/AuthBridge';
import { AuthEventType } from '@/shared/types/shared.types';

export const LinkedAccountAlert: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [provider, setProvider] = useState<string>('');
  
  useEffect(() => {
    // Listen for auth events
    const unsubscribe = authBridge.onAuthEvent((event) => {
      if (event.type === AuthEventType.USER_UPDATED && event.provider) {
        setProvider(event.provider);
        setIsVisible(true);
      }
    });
    
    // Cleanup subscription
    return () => {
      unsubscribe.unsubscribe();
    };
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20 mb-4">
      <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
      <AlertTitle>Account Successfully Linked!</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>Your {provider} account has been linked to your profile.</span>
        <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
          Dismiss
        </Button>
      </AlertDescription>
    </Alert>
  );
};
