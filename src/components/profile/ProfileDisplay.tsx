
import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { UserProfile, UserMetadata } from '@/types/auth.unified';

// Component that checks if user_metadata exists and has expected properties
// Creating a safer access pattern for user metadata
const getUserMetadataValue = (
  user: UserProfile | null, 
  property: keyof UserMetadata,
  fallback: string
): string => {
  if (!user) return fallback;
  if (!user.user_metadata) return fallback;
  
  const value = user.user_metadata[property];
  return value ? String(value) : fallback;
};

// Safe boolean getter with fallback
const getUserMetadataBoolValue = (
  user: UserProfile | null,
  property: keyof UserMetadata,
  fallback: boolean
): boolean => {
  if (!user) return fallback;
  if (!user.user_metadata) return fallback;
  
  const value = user.user_metadata[property];
  return typeof value === 'boolean' ? value : fallback;
};

interface ProfileDisplayProps {
  user: UserProfile;
  onEdit: () => void;
}

// This component now safely renders profile information with fallbacks
export function ProfileDisplay({ user, onEdit }: ProfileDisplayProps) {
  const displayName = getUserMetadataValue(user, 'display_name', user.username || user.email || 'User');
  const fullName = getUserMetadataValue(user, 'full_name', displayName);
  const avatarUrl = getUserMetadataValue(user, 'avatar_url', 
    `https://api.dicebear.com/7.x/initials/svg?seed=${user.email || 'user'}`
  );
  const bio = getUserMetadataValue(user, 'bio', 'No bio available');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20">
          <img 
            src={avatarUrl} 
            alt={displayName}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <h3 className="text-xl font-semibold">{displayName}</h3>
          {fullName !== displayName && (
            <p className="text-muted-foreground">{fullName}</p>
          )}
          <button
            onClick={onEdit}
            className="text-sm bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1 rounded transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Bio</h4>
          <p className="text-sm">{bio}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
          <p className="text-sm">{user.email || 'No email available'}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Username</h4>
          <p className="text-sm">{user.username || 'No username set'}</p>
        </div>
        
        <div className="pt-2">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Preferences</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
              <span className="text-xs">Theme</span>
              <span className="text-xs font-medium">
                {getUserMetadataValue(user, 'theme_preference', 'System')}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
              <span className="text-xs">Motion</span>
              <span className="text-xs font-medium">
                {getUserMetadataBoolValue(user, 'motion_enabled', true) ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
