import { useState } from "react";
import { useAuthStore } from "@/app/stores/auth/store";
import { UserMenu } from "@/components/auth/UserMenu";
import { LoginSheet } from "./LoginSheet";

export const AuthSection = () => {
  const user = useAuthStore((state) => state.user);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="flex items-center gap-4">
      {user ? (
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