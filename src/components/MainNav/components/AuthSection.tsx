
import { useState } from "react";
import { UserMenu } from "@/components/auth/UserMenu";
import { LoginSheet } from "./LoginSheet";
import { useAuth } from "@/auth/hooks/useAuth";

export const AuthSection = () => {
  const { isAuthenticated } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="flex items-center gap-4">
      {isAuthenticated ? (
        <UserMenu />
      ) : (
        <LoginSheet 
          isOpen={isLoginOpen}
          onOpenChange={setIsLoginOpen}
        />
      )}
    </div>
  );
};
