
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Simplified AuthSection without auth checks
export const AuthSection = () => {
  // Always show a styled link to admin section, no authentication checks
  return (
    <Link to="/admin">
      <Button 
        variant="outline" 
        size="sm"
        className="site-border-glow cyber-effect-text group"
      >
        <span className="relative z-10">Admin</span>
        <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></span>
      </Button>
    </Link>
  );
};
