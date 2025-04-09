
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { showAdminButtonAtom, showAdminWrenchAtom } from "@/admin/atoms/ui.atoms";
import { Wrench, User } from "lucide-react";
import { useAuthAtoms } from "@/hooks/useAuthAtoms";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoginSheet } from "./LoginSheet";
import { useState } from "react";

/**
 * AuthSection Component
 * 
 * Displays authentication controls in the MainNav, including:
 * - Login/Avatar button
 * - Admin access links (when authorized)
 * 
 * Uses Jotai for reactive state management and integrates with the auth system.
 */
export const AuthSection: React.FC = () => {
  const [showAdminButton] = useAtom(showAdminButtonAtom);
  const [showAdminWrench] = useAtom(showAdminWrenchAtom);
  const { hasAdminAccess, user, isAuthenticated } = useAuthAtoms();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

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
            aria-label="Admin Dashboard"
          >
            <Wrench className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full animate-pulse"></span>
          </Button>
        </Link>
      )}

      {/* Avatar Login Button with Cyberpunk Effect */}
      {isAuthenticated ? (
        <Avatar 
          className="h-8 w-8 border-2 border-primary/50 hover:border-primary transition-all duration-300 cursor-pointer site-glow-hover cyber-effect-text"
          onClick={() => setIsLoginOpen(true)}
        >
          <AvatarImage src={user?.user_metadata?.avatar_url} alt="User avatar" />
          <AvatarFallback className="bg-primary/20 text-primary">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      ) : (
        <Button 
          size="sm" 
          variant="outline"
          className="flex items-center gap-2 border-primary/40 text-primary bg-background/40 hover:bg-primary/20 cyber-effect-text site-glow-hover"
          onClick={() => setIsLoginOpen(true)}
        >
          <User className="h-4 w-4" />
          <span>Login</span>
        </Button>
      )}

      {/* Login Sheet with all auth options */}
      <LoginSheet 
        isOpen={isLoginOpen}
        onOpenChange={setIsLoginOpen}
      />
    </div>
  );
};
