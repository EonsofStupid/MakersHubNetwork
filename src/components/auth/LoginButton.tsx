import { useState } from "react";
import { LoginModal } from "./LoginModal";
import { Button } from "@/components/ui/button";

export const LoginButton = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <LoginModal 
      isOpen={isLoginOpen}
      onOpenChange={setIsLoginOpen}
    />
  );
};