
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { User } from '@/shared/types/shared.types';

interface UserAvatarProps {
  user: User | null;
  className?: string;
  fallbackClassName?: string;
  fallbackText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * UserAvatar component that displays a user's avatar
 * Shows initials as fallback if no image is available
 */
export function UserAvatar({ 
  user, 
  className = '', 
  fallbackClassName = '',
  fallbackText,
  size = 'md'
}: UserAvatarProps) {
  // Get initials from name
  const getInitials = (): string => {
    if (fallbackText) return fallbackText;
    if (!user) return '?';
    
    const name = user.profile?.display_name || 
                user.user_metadata?.full_name || 
                user.user_metadata?.name ||
                user.email || '';
    
    return name
      .split(/\s+/)
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Determine avatar size
  const avatarSize = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  }[size];
  
  // Determine fallback text size
  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  }[size];
  
  // Get avatar URL
  const avatarUrl = user?.profile?.avatar_url || 
                   user?.user_metadata?.avatar_url ||
                   user?.user_metadata?.picture ||
                   '';
  
  return (
    <Avatar className={`${avatarSize} ${className}`}>
      <AvatarImage src={avatarUrl} alt={getInitials()} />
      <AvatarFallback className={`${textSize} ${fallbackClassName}`}>
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
}
