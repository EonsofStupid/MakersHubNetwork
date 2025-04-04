
import { useState } from "react";
import { UserMenu } from "@/components/auth/UserMenu";
import { LoginSheet } from "./LoginSheet";
import { useAuth } from "@/auth/hooks/useAuth";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/constants/logLevel";

export const AuthSection = () => {
  const { isAuthenticated } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const logger = useLogger('AuthSection', { category: LogCategory.UI });
  
  logger.debug('Rendering AuthSection', { details: { isAuthenticated } });

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
