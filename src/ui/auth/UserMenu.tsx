
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/core/avatar";
import { Button } from "@/ui/core/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/ui/core/dropdown-menu";
import { ProfileDialog } from "@/ui/profile/ProfileDialog";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/auth/hooks/useAuth";

interface UserMenuProps {
  user: User;
}

export function UserMenu({ user }: UserMenuProps) {
  const [showProfile, setShowProfile] = useState(false);
  const { logout } = useAuth();

  const userInitials = user.displayName 
    ? user.displayName.split(' ').map(name => name[0]).join('').toUpperCase()
    : 'U';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.displayName || ''} />}
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setShowProfile(true)}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout()}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileDialog open={showProfile} onClose={() => setShowProfile(false)} user={user} />
    </>
  );
}
