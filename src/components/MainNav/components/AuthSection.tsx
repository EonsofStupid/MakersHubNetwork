
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "@/components/auth/UserMenu";
import { LoginSheet } from "./LoginSheet";
import { Skeleton } from "@/components/ui/skeleton";

export const AuthSection = () => {
  const { status, isLoading } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Use direct status check for better reliability
  const isAuthenticated = status === "authenticated";

  // Show skeleton loader while auth is initializing
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-16" />
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
