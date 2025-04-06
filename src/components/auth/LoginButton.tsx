
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoginModal } from './LoginModal';

export function LoginButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setIsModalOpen(true)}>
        Login
      </Button>
      
      <LoginModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </>
  );
}
