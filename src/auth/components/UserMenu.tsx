
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/core/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/core/avatar";
import { ProfileDialog } from "@/shared/ui/profile/ProfileDialog";
import { authBridge } from "@/bridges/AuthBridge";
import { User } from "@/shared/types/user";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";

interface UserMenuProps {
  user: User;
}

export function UserMenu({ user }: UserMenuProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await authBridge.logout();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openProfileDialog = () => {
    setIsProfileOpen(true);
  };

  const closeProfileDialog = () => {
    setIsProfileOpen(false);
  };

  // Get user display name
  const userDisplayName = user.user_metadata?.name || user.email;
  
  // Get first letter for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const firstLetter = userDisplayName
    ? getInitials(userDisplayName)
    : "U";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage
              src={user.user_metadata?.avatar_url || ""}
              alt={userDisplayName}
            />
            <AvatarFallback>{firstLetter}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || userDisplayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={openProfileDialog} className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileDialog open={isProfileOpen} onClose={closeProfileDialog} user={user} />
    </>
  );
}
