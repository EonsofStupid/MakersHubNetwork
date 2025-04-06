
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoginModal } from './LoginModal';

export function LoginButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        Login
      </Button>
      
      <LoginModal 
        open={open} 
        onOpenChange={setOpen} 
      />
    </>
  );
}
