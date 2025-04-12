
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { cn } from '@/shared/utils/cn';
import { User } from '@/shared/types';

interface UserAvatarProps {
  user: User | null;
  fallbackText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function UserAvatar({ 
  user, 
  fallbackText = 'U',
  size = 'md',
  className
}: UserAvatarProps) {
  const avatarUrl = user?.user_metadata?.avatar_url;
  
  // Generate fallback initials if no specific fallback provided
  const initials = fallbackText || 
    (user?.user_metadata?.name ? 
      user.user_metadata.name.charAt(0).toUpperCase() : 
      'U');
  
  // Size mappings
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-lg',
    xl: 'h-24 w-24 text-2xl'
  };
  
  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage
        src={avatarUrl}
        alt={user?.user_metadata?.name || 'User avatar'}
      />
      <AvatarFallback className="bg-primary/10 text-primary">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
