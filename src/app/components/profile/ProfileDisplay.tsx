
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { useAuthStore } from '@/auth/store/auth.store';
import { cn } from '@/shared/utils/cn';
import { Pencil } from 'lucide-react';

interface ProfileDisplayProps {
  className?: string;
  onEditClick?: () => void;
}

export function ProfileDisplay({ className, onEditClick }: ProfileDisplayProps) {
  const { user, profile } = useAuthStore();

  if (!user) {
    return (
      <Card className={cn('w-full max-w-md mx-auto', className)}>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            You need to be signed in to view your profile
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full max-w-md mx-auto', className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Profile</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onEditClick}
          className="h-8 w-8"
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit profile</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {user.user_metadata?.avatar_url && (
            <img
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="h-16 w-16 rounded-full object-cover border border-border"
            />
          )}
          <div>
            <h3 className="font-medium">
              {user.user_metadata?.name || 'User'}
            </h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {profile?.bio && (
          <div>
            <h4 className="text-sm font-medium mb-1">Bio</h4>
            <p className="text-sm text-muted-foreground">{profile.bio}</p>
          </div>
        )}

        {profile?.website && (
          <div>
            <h4 className="text-sm font-medium mb-1">Website</h4>
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              {profile.website}
            </a>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium mb-1">Roles</h4>
          <div className="flex flex-wrap gap-2">
            {user.app_metadata?.roles?.map((role) => (
              <span
                key={role}
                className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
              >
                {role}
              </span>
            ))}
            {(!user.app_metadata?.roles || user.app_metadata.roles.length === 0) && (
              <span className="text-sm text-muted-foreground">No roles assigned</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
