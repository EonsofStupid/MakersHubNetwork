
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { showAdminButtonAtom } from "@/admin/atoms/ui.atoms";
import { Wrench } from "lucide-react";
import { useAuthAtoms } from "@/hooks/useAuthAtoms";

// AuthSection with Jotai for reactivity
export const AuthSection = () => {
  const [showAdminButton] = useAtom(showAdminButtonAtom);
  const { hasAdminAccess } = useAuthAtoms();

  // Always show the link, but conditionally style it based on admin access
  return (
    <>
      {hasAdminAccess && (
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
      )}
      
      {hasAdminAccess && (
        <Link to="/admin">
          <Button
            variant="ghost"
            size="icon"
            className="relative ml-2 text-primary hover:text-white hover:bg-primary/20"
          >
            <Wrench className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </>
  );
};
