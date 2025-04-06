
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoginSheet } from '@/components/MainNav/components/LoginSheet';

export function LoginButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        Login
      </Button>
      
      <LoginSheet 
        isOpen={open} 
        onOpenChange={setOpen} 
      />
    </>
  );
}
