
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet';
import { Button } from '@/shared/ui/button';
import { UserAvatar } from '@/shared/ui/UserAvatar';
import { Badge } from '@/shared/ui/badge';
import { UserRole } from '@/shared/types/shared.types';

interface UserMenuSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userDisplayName: string;
  userEmail: string;
  userAvatar?: string;
  onShowProfile: () => void;
  onLogout: () => void;
  roles: UserRole[];
}

export const UserMenuSheet: React.FC<UserMenuSheetProps> = ({
  isOpen,
  onOpenChange,
  userDisplayName,
  userEmail,
  userAvatar,
  onShowProfile,
  onLogout,
  roles
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader className="text-left">
          <SheetTitle>Your Account</SheetTitle>
          <SheetDescription>
            Manage your account settings
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6">
          <div className="flex items-center gap-4 mb-6">
            <UserAvatar user={{ email: userEmail, name: userDisplayName, avatar_url: userAvatar } as any} size="lg" />
            <div>
              <h3 className="font-medium">{userDisplayName}</h3>
              <p className="text-sm text-muted-foreground">{userEmail}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Roles</h4>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <Badge key={role} variant="outline">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button className="w-full" variant="outline" onClick={onShowProfile}>
            View Profile
          </Button>
          
          <Button className="w-full" variant="outline" asChild>
            <a href="/settings">Settings</a>
          </Button>
        </div>
        
        <SheetFooter className="mt-6">
          <Button onClick={onLogout} variant="destructive" className="w-full">
            Logout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
