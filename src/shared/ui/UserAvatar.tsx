
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { UserProfile } from '@/shared/types/auth.types';

export interface UserAvatarProps {
  user: UserProfile | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md', className = '' }) => {
  // Generate avatar size classes
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };
  
  // Get initial letter from user email or name
  const getInitials = () => {
    if (!user) return '?';
    
    const name = user.name || user.email || '';
    if (!name) return '?';
    
    return name.charAt(0).toUpperCase();
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage 
        src={user?.avatar_url || ''} 
        alt={user?.name || user?.email || 'User'}
      />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
};
