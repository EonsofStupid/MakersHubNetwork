
import React, { useState } from "react";
import { Button } from "@/ui/core/button";
import { useNavigate } from "react-router-dom";
import { User, LogIn } from "lucide-react";
import { useAuthState } from "@/auth/hooks/useAuthState";
import { LoginSheet } from "./LoginSheet";
import { UserMenu } from "@/auth/components/UserMenu";
import { authBridge } from "@/bridges";

export const AuthSection = () => {
  const navigate = useNavigate();
  const { user, status } = useAuthState();
  const [isLoginSheetOpen, setIsLoginSheetOpen] = useState(false);
  
  const handleLoginClick = () => {
    setIsLoginSheetOpen(true);
  };
  
  const handleProfileClick = () => {
    navigate("/profile");
  };
  
  if (status.isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <User className="mr-2 h-4 w-4" />
        Loading...
      </Button>
    );
  }
  
  // User is logged in - show profile button/menu
  if (status.isAuthenticated && user) {
    const displayName = user.user_metadata?.name || user.user_metadata?.full_name || user.email;
    const avatarUrl = user.user_metadata?.avatar_url;
    
    return <UserMenu />;
  }
  
  // User is not logged in - show login button
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2 border-primary/20"
        onClick={handleLoginClick}
      >
        <LogIn className="h-4 w-4" />
        <span className="hidden md:inline">Login</span>
      </Button>
      
      <LoginSheet 
        open={isLoginSheetOpen} 
        onOpenChange={setIsLoginSheetOpen} 
      />
    </>
  );
};
