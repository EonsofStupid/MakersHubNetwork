
import { useState } from "react";
import { LoginModal } from "./LoginModal";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export const LoginButton = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsLoginOpen(true)}
        className="flex items-center gap-1 text-primary border-primary/40 hover:bg-primary/20"
      >
        <LogIn className="h-4 w-4" />
        <span>Login</span>
      </Button>
      
      <LoginModal 
        isOpen={isLoginOpen}
        onOpenChange={setIsLoginOpen}
      />
    </>
  );
};
