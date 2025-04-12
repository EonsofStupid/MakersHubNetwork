
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

interface UserAvatarProps {
  user?: {
    id: string;
    email: string;
    user_metadata?: Record<string, any>;
    display_name?: string;
  } | null;
  fallbackText?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({ 
  user, 
  fallbackText, 
  size = "md", 
  className = "" 
}: UserAvatarProps) {
  // Get avatar URL from user metadata if available
  const avatarUrl = user?.user_metadata?.avatar_url;
  
  // Get display name from user metadata if available
  const displayName = user?.display_name || user?.user_metadata?.full_name;
  
  // Generate fallback initials from display name or email
  const generateInitials = (): string => {
    if (fallbackText) return fallbackText;
    
    if (displayName) {
      return displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    
    return "U";
  };
  
  // Determine avatar size
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };
  
  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={avatarUrl || undefined} alt={displayName || "User"} />
      <AvatarFallback>{generateInitials()}</AvatarFallback>
    </Avatar>
  );
}
