
import React from 'react';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { Card } from '@/shared/ui/core/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/core/avatar';
import { useLogger } from '@/shared/hooks/use-logger';
import { LogCategory } from '@/shared/types/logging';
import { User, UserMetadata } from '@/shared/types/auth.types';

export function ProfileDisplay() {
  const { user, profile, status } = useAuthState();
  const logger = useLogger('ProfileDisplay', LogCategory.UI);
  
  // Cast user to proper type
  const typedUser = user as User | null;
  
  // Display avatar and basic user info
  const userMetadata = typedUser?.user_metadata as UserMetadata | undefined;
  const displayName = profile?.display_name || userMetadata?.full_name || typedUser?.email || 'User';
  const avatarUrl = profile?.avatar_url || userMetadata?.avatar_url;
  const userInitial = (typedUser?.email || 'U').charAt(0).toUpperCase();
  
  if (status.isLoading) {
    return <div>Loading profile...</div>;
  }
  
  if (!status.isAuthenticated || !user) {
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
