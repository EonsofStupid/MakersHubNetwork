import { useState } from "react";
import { useAuthStore } from "@/stores/auth/store";
import { UserMenu } from "@/shared/components/auth/UserMenu";
import { LoginSheet } from "./LoginSheet";

export const AuthSection = () => {
  const status = useAuthStore((state) => state.status);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const isAuthenticated = status === "authenticated";

  return (
    <div className="flex items-center">
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