
import React from 'react';
import { User } from '@/shared/types/shared.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

interface UserAvatarProps {
  user: User | null;
  size?: 'sm' | 'md' | 'lg';
  fallback?: React.ReactNode;
}

export function UserAvatar({ 
  user, 
  size = 'md', 
  fallback 
}: UserAvatarProps) {
  const getInitials = (name?: string): string => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-xl',
  };
  
  const displayName = user?.profile?.display_name || user?.email?.split('@')[0] || '?';
  const avatarUrl = user?.profile?.avatar_url;
  
  return (
    <Avatar className={sizeClasses[size]}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
      <AvatarFallback>
        {fallback || getInitials(displayName)}
      </AvatarFallback>
    </Avatar>
  );
}
