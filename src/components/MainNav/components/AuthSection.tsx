
import React, { useCallback, memo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

// Memoize the component to prevent unnecessary rerenders
export const AuthSection = memo(() => {
  const { user } = useAuth();
  
  // If logged in, show avatar with dropdown
  if (user) {
    return (
      <Button variant="outline" className="site-border-glow">
        Profile
      </Button>
    );
  }
  
  // If not logged in, show login button with animation effects
  return (
    <Link to="/">
      <Button 
        variant="outline" 
        size="sm"
        className="site-border-glow cyber-effect-text group"
      >
        <span className="relative z-10">Login</span>
        <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></span>
      </Button>
    </Link>
  );
});
