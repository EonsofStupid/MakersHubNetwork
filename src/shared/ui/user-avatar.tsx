
import React from 'react';
import { User } from '@/shared/types/shared.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { cn } from '@/shared/utils/cn';

interface UserAvatarProps {
  user?: User | null;
  fallbackText?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackClassName?: string;
}

export function UserAvatar({ 
  user, 
  fallbackText,
  size = 'md',
  className,
  fallbackClassName
}: UserAvatarProps) {
  // Get avatar URL from user
  const avatarUrl = user?.user_metadata?.avatar_url;
  
  // Determine fallback text (initials)
  const initials = React.useMemo(() => {
    if (fallbackText) return fallbackText;
    
    // Use name from user_metadata
    const name = user?.user_metadata?.name || 
                user?.user_metadata?.full_name ||
                user?.user_metadata?.display_name ||
                user?.email?.charAt(0);
                
    if (!name) return '?';
    
    // If it's an email, use the first character
    if (name.includes('@')) return name.charAt(0).toUpperCase();
    
    // Get initials from name
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }, [fallbackText, user]);
  
  // Size classes
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };
  
  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt="User avatar" />}
      <AvatarFallback className={fallbackClassName}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
