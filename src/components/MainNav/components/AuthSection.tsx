
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { showAdminButtonAtom, showAdminWrenchAtom } from "@/admin/atoms/ui.atoms";
import { Wrench } from "lucide-react";
import { useAuthAtoms } from "@/hooks/useAuthAtoms";

// AuthSection with Jotai for reactivity
export const AuthSection = () => {
  const [showAdminButton] = useAtom(showAdminButtonAtom);
  const [showAdminWrench] = useAtom(showAdminWrenchAtom);
  const { hasAdminAccess } = useAuthAtoms();

  return (
    <div className="flex items-center gap-2">
      {/* Only show Admin button if user has admin access */}
      {hasAdminAccess && showAdminButton && (
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
      
      {/* Only show Admin wrench if user has admin access */}
      {hasAdminAccess && showAdminWrench && (
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
    </div>
  );
};
