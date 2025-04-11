
import React from 'react';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

export function ProfileDisplay() {
  const { user, profile, isAuthenticated, isLoading } = useAuthState();
  const logger = useLogger('ProfileDisplay', LogCategory.UI);
  
  // Display avatar and basic user info
  const displayName = profile?.display_name || user?.user_metadata?.full_name || user?.email || 'User';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url as string;
  const userInitial = (user?.email as string || 'U').charAt(0).toUpperCase();
  
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
          <p className="text-sm text-muted-foreground">{user.email}</p>
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
