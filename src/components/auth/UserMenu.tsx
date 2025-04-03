import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Shield, UserCircle, Settings, LogOut, LinkIcon, Github, Mail, Paintbrush } from "lucide-react";
import { useAuth } from "@/auth/hooks/useAuth";
import { useAdminAccess } from "@/admin/hooks/useAdminAccess";
import { useLogger } from "@/hooks/use-logger";
import { LogCategory } from "@/logging";
import { cn } from "@/lib/utils";
import { useThemeContext } from "@/admin/hooks/useThemeContext";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { hasAdminAccess } = useAdminAccess();
  const { toast } = useToast();
  const logger = useLogger("UserMenu", LogCategory.UI);
  const { themeValues } = useThemeContext('site');

  const initials = user?.email
    ? user.email
        .split("@")[0]
        .substring(0, 2)
        .toUpperCase()
    : "MK";

  const handleLogout = async () => {
    try {
      logger.info("User initiated logout");
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      logger.error("Logout failed", { details: { error } });
      toast({
        title: "Logout failed",
        description: "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  const openLinkingFlow = () => {
    // Redirect to a custom page that will handle the linking
    logger.info("Opening account linking flow");
    window.location.href = `${window.location.origin}/link-account`;
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="group relative h-10 w-10 rounded-full border border-primary/30 p-0 hover:bg-background/40 hover:shadow-[0_0_10px_rgba(0,240,255,0.5)] transition-all duration-300"
          style={{ 
            borderColor: `${themeValues.primaryColor}30`,
            boxShadow: open ? `0 0 10px ${themeValues.primaryColor}50` : 'none',
          }}
        >
          <Avatar className="h-9 w-9 rounded-full overflow-hidden bg-background/30 border border-primary/20 ring-2 ring-primary/10">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-black/50 text-primary tracking-wider font-mono text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -right-1 -top-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
          </span>
          <span className="absolute inset-0 rounded-full border border-primary/0 group-hover:border-primary/40 group-hover:shadow-[0_0_5px_rgba(0,240,255,0.3),inset_0_0_5px_rgba(0,240,255,0.2)] transition-all duration-300"></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 backdrop-blur-xl bg-background/80 border-primary/20 shadow-[0_0_20px_rgba(0,240,255,0.15)] animate-in zoom-in-90 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
        align="end"
        sideOffset={8}
      >
        <div className="flex flex-col space-y-1 p-2">
          <DropdownMenuLabel className="font-mono tracking-tight text-primary">
            <span className="cyberpunk-text">My Account</span>
          </DropdownMenuLabel>
          <p className="text-xs text-muted-foreground truncate px-2">
            {user?.email}
          </p>
        </div>
        
        <DropdownMenuSeparator className="bg-primary/20" />
        
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex cursor-pointer items-center gap-2 text-foreground/90 hover:text-primary focus:text-primary">
              <UserCircle className="h-4 w-4" />
              <span>Profile</span>
              <span className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 opacity-0 transition-all group-hover:opacity-100">
                <span className="data-pulse"></span>
              </span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex cursor-pointer items-center gap-2 text-foreground/90 hover:text-primary focus:text-primary">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/link-account" className="flex cursor-pointer items-center gap-2 text-foreground/90 hover:text-primary focus:text-primary">
              <LinkIcon className="h-4 w-4" />
              <span>Link Accounts</span>
            </Link>
          </DropdownMenuItem>

          {/* Theme Settings Menu Item */}
          <DropdownMenuItem asChild>
            <Link to="/theme-settings" className="flex cursor-pointer items-center gap-2 text-foreground/90 hover:text-primary focus:text-primary">
              <Paintbrush className="h-4 w-4" />
              <span>Theme Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        {hasAdminAccess && (
          <>
            <DropdownMenuSeparator className="bg-primary/20" />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link 
                  to="/admin" 
                  className={cn(
                    "flex cursor-pointer items-center gap-2 text-foreground/90 hover:text-primary focus:text-primary relative group/admin"
                  )}
                >
                  <Shield className="h-4 w-4 text-secondary" />
                  <span className="font-medium text-secondary">Admin Panel</span>
                  <span className="absolute inset-0 rounded border border-secondary/0 group-hover/admin:border-secondary/20 group-hover/admin:bg-secondary/5"></span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
        
        <DropdownMenuSeparator className="bg-primary/20" />
        
        <div className="p-2">
          <DropdownMenuItem 
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-2 text-destructive hover:text-destructive/90 focus:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </div>
        
        {user?.app_metadata?.provider && (
          <div className="px-2 py-1.5 text-xs text-muted-foreground flex items-center gap-2">
            <span>Signed in with:</span>
            {user.app_metadata.provider === 'github' ? (
              <Github className="h-3 w-3 text-muted-foreground" />
            ) : user.app_metadata.provider === 'google' ? (
              <Mail className="h-3 w-3 text-muted-foreground" />
            ) : (
              <span className="font-mono">{user.app_metadata.provider}</span>
            )}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
