
import React, { useState } from 'react';
import { UserProfile } from '@/shared/types/shared.types';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/avatar';
import { Edit, Mail, User, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ProfileDisplayProps {
  profile: UserProfile;
  isEditable?: boolean;
  onEdit?: () => void;
}

export const ProfileDisplay: React.FC<ProfileDisplayProps> = ({
  profile,
  isEditable = false,
  onEdit
}) => {
  // Extract the first letter of the name or email for the avatar fallback
  const getInitials = () => {
    if (profile.name) return profile.name.charAt(0).toUpperCase();
    return profile.email.charAt(0).toUpperCase();
  };

  // Format the last active date
  const getLastActive = () => {
    if (profile.last_sign_in_at) {
      return `Last active ${formatDistanceToNow(new Date(profile.last_sign_in_at))} ago`;
    }
    return 'Not recently active';
  };

  // Format the joined date
  const getJoinedDate = () => {
    if (profile.created_at) {
      return `Joined ${formatDistanceToNow(new Date(profile.created_at))} ago`;
    }
    return 'Recently joined';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col space-y-1">
          <CardTitle>{profile.name || 'User'}</CardTitle>
          <CardDescription>{getLastActive()}</CardDescription>
        </div>
        {isEditable && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-2">
              <AvatarImage src={profile.avatar_url || ''} alt={profile.name || 'User'} />
              <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 space-y-4">
            <div className="grid gap-3">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm font-medium">{profile.name || 'No name provided'}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{profile.email}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{getJoinedDate()}</span>
              </div>
            </div>

            {profile.bio && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">About</h3>
                <p className="text-sm text-muted-foreground">{profile.bio}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileDisplay;
