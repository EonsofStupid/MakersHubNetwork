import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/auth/hooks/useAuth";
import { useAdminAccess } from "@/admin/hooks/useAdminAccess";
import { LogCategory } from "@/constants/logLevel";
import { useLogger } from "@/hooks/use-logger";

export const UserMenu = () => {
  const { user, roles, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('');
  const { hasAdminAccess } = useAdminAccess();
  const logger = useLogger('UserMenu', { category: LogCategory.UI });

  const handleLogout = async () => {
    logger.info('User initiated logout');
    await logout();
    router.push('/login');
  };

  const displayName = user?.profile?.display_name || user?.email || 'User';
  const avatarUrl = user?.profile?.avatar_url || user?.user_metadata?.avatar_url || '';

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full h-9 w-9 flex items-center justify-center relative">
          <Avatar className="h-9 w-9">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={displayName} />
            ) : (
              <AvatarFallback>{displayName ? displayName[0].toUpperCase() : 'U'}</AvatarFallback>
            )}
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 mr-2" align="end" forceMount>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => router.push('/profile')}>
          Profile
        </DropdownMenuItem>
        {hasAdminAccess && (
          <DropdownMenuItem onSelect={() => router.push('/admin')}>
            Admin Dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
