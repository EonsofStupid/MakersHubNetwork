
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/core/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/core/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/core/popover';
import { useToast } from '@/shared/hooks/use-toast';
import { User, UserMetadata } from '@/shared/types/auth.types';
import { authBridge } from '@/bridges/AuthBridge';
import { ProfileDialog } from '@/ui/profile/ProfileDialog';

interface UserMenuProps {
  user: User;
}

export function UserMenu({ user }: UserMenuProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const userMetadata = user?.user_metadata as UserMetadata | undefined;
  const displayName = user?.profile?.display_name || userMetadata?.full_name || user?.email || 'User';
  const avatarUrl = user?.profile?.avatar_url || userMetadata?.avatar_url;
  
  const handleLogout = async () => {
    try {
      await authBridge.logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleProfileClick = () => {
    setIsProfileOpen(true);
  };
  
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className="text-xs">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="end">
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback>
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                  {user.email}
                </p>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Button variant="outline" size="sm" onClick={handleProfileClick}>
                Edit Profile
              </Button>
              {user.profile?.roles?.includes('admin') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin')}
                >
                  Admin Dashboard
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <ProfileDialog open={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}
