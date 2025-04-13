import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/avatar';
import { UserProfile } from '@/shared/types/shared.types';

interface UserAvatarProps {
  user?: UserProfile | null;
  fallbackText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function UserAvatar({ 
  user, 
  fallbackText, 
  size = 'md',
  className = ''
}: UserAvatarProps) {
  // Size mappings
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  // Get user avatar URL from metadata if available
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  
  // Fallback text (initials)
  const text = fallbackText || getInitials(user?.email || user?.user_metadata?.full_name as string || '');

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt="User avatar" />}
      <AvatarFallback>{text}</AvatarFallback>
    </Avatar>
  );
}

// Helper function to get initials from a name or email
function getInitials(nameOrEmail: string): string {
  if (!nameOrEmail) return '?';
  
  // If it's an email, get first letter before the @ sign
  if (nameOrEmail.includes('@')) {
    return nameOrEmail.split('@')[0][0].toUpperCase();
  }
  
  // Otherwise get initials from name
  return nameOrEmail
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
