import { useState } from "react";
import { useAuthStore } from "@/stores/auth/store";
import { UserMenu } from "../../auth/UserMenu";
import { LoginSheet } from "./LoginSheet";

export const AuthSection = () => {
  const status = useAuthStore((state) => state.status);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="flex items-center gap-4">
      {status === "authenticated" ? (
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