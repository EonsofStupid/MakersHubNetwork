
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { cn } from '@/shared/utils/cn';

export interface UserAvatarProps {
  user?: {
    id: string;
    email: string;
    display_name?: string;
    user_metadata?: Record<string, any>;
  };
  fallbackText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UserAvatar({ user, fallbackText, size = 'md', className }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base'
  };

  const avatarUrl = user?.user_metadata?.avatar_url || '';
  
  // Generate fallback from display name or email
  const getFallback = () => {
    if (fallbackText) return fallbackText;
    
    if (user?.display_name) {
      return user.display_name.charAt(0).toUpperCase();
    }
    
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={avatarUrl} alt={user?.display_name || user?.email || 'User'} />
      <AvatarFallback>{getFallback()}</AvatarFallback>
    </Avatar>
  );
}
