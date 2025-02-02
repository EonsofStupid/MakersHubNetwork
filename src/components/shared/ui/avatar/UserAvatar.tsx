import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/store/auth-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AvatarLoadingState } from "./components/AvatarLoadingState";
import { AvatarFallbackContent } from "./components/AvatarFallbackContent";

interface UserAvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showFallback?: boolean;
  onClick?: () => void;
}

export const UserAvatar = ({ 
  className,
  size = 'md',
  showFallback = true,
  onClick 
}: UserAvatarProps) => {
  const navigate = useNavigate();
  const { session, user, isLoading } = useAuthStore();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    console.log('UserAvatar: Auth state changed', {
      isAuthenticated: !!session,
      userId: session?.user?.id,
      avatarUrl: user?.user_metadata?.avatar_url
    });
  }, [session, user]);

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  const handleAvatarClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    if (!session) {
      navigate("/login");
      toast.info("Sign in to access your profile", {
        description: "Create an account or sign in to access all features"
      });
      return;
    }

    navigate("/profile");
  };

  if (isLoading) {
    return <AvatarLoadingState size={size} className={className} />;
  }

  return (
    <Avatar 
      className={cn(
        sizeClasses[size],
        "relative cursor-pointer transition-all duration-300",
        isHovered && "scale-110",
        className
      )}
      onClick={handleAvatarClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {session?.user && !imageError ? (
        <AvatarImage
          src={user?.user_metadata?.avatar_url || "/admin/placeholder-avatar.png"}
          alt="User avatar"
          onError={() => setImageError(true)}
          className="object-cover"
        />
      ) : showFallback ? (
        <AvatarFallbackContent email={user?.email} />
      ) : null}
      
      {/* Hover effect */}
      <div 
        className={cn(
          "absolute inset-0 rounded-full opacity-0 transition-opacity duration-300",
          isHovered && "opacity-100"
        )}
        style={{
          background: `linear-gradient(135deg, #4d00b3, #72228c, #b0e653)`,
          filter: 'blur(8px)',
          zIndex: -1
        }}
      />
    </Avatar>
  );
};