
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoginSheet } from '@/components/MainNav/components/LoginSheet';

export function LoginButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        className="site-border-glow cyber-effect-text group"
        onClick={() => setOpen(true)}
      >
        <span className="relative z-10">Login</span>
        <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></span>
      </Button>
      
      <LoginSheet 
        isOpen={open} 
        onOpenChange={setOpen} 
      />
    </>
  );
}
