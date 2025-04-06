
import { useState } from "react";
import { LoginSheet } from "@/components/MainNav/components/LoginSheet";
import { Button } from "@/components/ui/button";
import { useAuthState } from "@/auth/hooks/useAuthState";

export const LoginButton = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { status } = useAuthState();
  
  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  return (
    <>
      {status !== 'authenticated' && (
        <Button 
          variant="outline"
          size="sm"
          onClick={handleLoginClick}
          className="cyber-button electric-text"
        >
          Login
        </Button>
      )}
      <LoginSheet 
        isOpen={isLoginOpen}
        onOpenChange={setIsLoginOpen}
      />
    </>
  );
};
