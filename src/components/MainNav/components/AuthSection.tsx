
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "@/components/auth/UserMenu";
import { LoginSheet } from "./LoginSheet";
import { Spinner } from "@/components/ui/spinner";

export const AuthSection = () => {
  const { status, isLoading } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const isAuthenticated = status === "authenticated";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-8">
        <Spinner size="sm" />
      </div>
    );
  }

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
