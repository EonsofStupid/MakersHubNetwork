
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/avatar';
import { User } from '@/shared/types/shared.types';
import { cn } from '@/lib/utils';

export interface UserAvatarProps {
  user: User | null;
  fallbackText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UserAvatar({ 
  user, 
  fallbackText, 
  size = 'md',
  className 
}: UserAvatarProps) {
  // Get initials or fallback
  const initials = React.useMemo(() => {
    if (fallbackText) return fallbackText;
    
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    }
    
    return user?.email?.charAt(0).toUpperCase() || '?';
  }, [user, fallbackText]);

  // Avatar URL
  const avatarUrl = user?.user_metadata?.avatar_url;

  // Size classes
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base'
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={avatarUrl || undefined} alt={initials} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
