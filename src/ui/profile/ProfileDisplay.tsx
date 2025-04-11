
import React from 'react';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { Card } from '@/ui/core/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/core/avatar';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { User } from '@/types/user';

export function ProfileDisplay() {
  const { user, profile, isAuthenticated, isLoading } = useAuthState();
  const logger = useLogger('ProfileDisplay', LogCategory.UI);
  
  // Cast user to proper type
  const typedUser = user as User | null;
  
  // Display avatar and basic user info
  const displayName = profile?.display_name || typedUser?.user_metadata?.full_name || typedUser?.email || 'User';
  const avatarUrl = profile?.avatar_url || typedUser?.user_metadata?.avatar_url as string;
  const userInitial = (typedUser?.email as string || 'U').charAt(0).toUpperCase();
  
  if (isLoading) {
    return <div>Loading profile...</div>;
  }
  
  if (!isAuthenticated || !user) {
    return <div>Please sign in to view your profile</div>;
  }
  
  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className="bg-primary/20 text-primary">
            {userInitial}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h3 className="font-medium">{displayName}</h3>
          <p className="text-sm text-muted-foreground">{typedUser?.email}</p>
        </div>
      </div>
      
      {profile && (
        <div className="mt-4 text-sm">
          {profile.bio && (
            <p className="mb-2">{profile.bio}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Member since {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      )}
    </Card>
  );
}
