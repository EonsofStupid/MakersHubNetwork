
import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LoginButton } from "@/components/auth/LoginButton";

// Memoize the component to prevent unnecessary rerenders
export const AuthSection = memo(() => {
  const { user, isAuthenticated } = useAuth();
  
  // If logged in, show avatar with dropdown
  if (isAuthenticated && user) {
    return (
      <Button variant="outline" className="site-border-glow">
        Profile
      </Button>
    );
  }
  
  // If not logged in, show login button with animation effects
  return <LoginButton />;
});

AuthSection.displayName = 'AuthSection';
