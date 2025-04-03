
import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from 'react-router-dom';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { safeDetails } from '@/logging/utils/safeDetails';
import { Shield, User, Settings, LogOut, Github, Mail, LinkIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/auth/hooks/useAuth';
import { useAdminAccess } from '@/admin/hooks/useAdminAccess';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function UserMenu() {
  const { user, roles, status, logout, isAuthenticated } = useAuth();
  const { hasAdminAccess } = useAdminAccess();
  const [isLoading, setIsLoading] = useState(false);
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);
  const logger = useLogger('UserMenu', LogCategory.UI);
  const { toast } = useToast();
  
  useEffect(() => {
    if (status === 'authenticated') {
      logger.debug('User authenticated, rendering user menu', {
        details: {
          userId: user?.id,
          roles,
          hasAdminAccess
        }
      });
    } else {
      logger.debug('No user authenticated, hiding user menu');
    }
  }, [status, user, logger, roles, hasAdminAccess]);
  
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      logger.error('Logout failed', { details: safeDetails(error) });
      toast({
        title: "Logout failed",
        description: "An error occurred during logout",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkGoogle = async () => {
    try {
      setIsLinkingGoogle(true);
      logger.info('Attempting to link Google account');
      
      // Initiate Google OAuth for account linking
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?linking=true`,
          scopes: 'email profile',
        }
      });
      
      logger.debug('Google auth initiated');
    } catch (error) {
      logger.error('Google account linking failed', { details: safeDetails(error) });
      toast({
        title: "Account linking failed",
        description: "Unable to link your Google account",
        variant: "destructive"
      });
      setIsLinkingGoogle(false);
    }
  };

  // Helper to get role badge
  const getRoleBadge = (role: string) => {
    const isAdmin = role.includes('admin');
    
    return (
      <Badge
        key={role}
        variant={isAdmin ? "default" : "secondary"}
        className={`flex items-center gap-1 text-xs py-0 px-2 animate-in fade-in-50 duration-300 ${
          isAdmin ? 'border-primary/30 hover:bg-primary/20' : ''
        }`}
      >
        {role === "super_admin" && <Icons.crown className="h-3 w-3 text-amber-400" />}
        {role === "admin" && <Icons.shield className="h-3 w-3 text-primary" />}
        {role.replace("_", " ")}
      </Badge>
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-8 w-8 rounded-full overflow-hidden border border-primary/30 
                   hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 
                   shadow-[0_0_10px_rgba(0,240,255,0.2)] hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]"
        >
          <Avatar className="h-8 w-8 ring-2 ring-primary/20 animate-morph-slow">
            <AvatarImage src={user?.user_metadata?.avatar_url as string} alt={user?.email as string} />
            <AvatarFallback className="bg-background/60 backdrop-blur-sm text-primary font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {hasAdminAccess && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-60 backdrop-blur-xl bg-background/80 border-primary/20 
                 shadow-[0_0_20px_rgba(0,240,255,0.15)] transform-gpu
                 before:content-[''] before:absolute before:inset-0 
                 before:bg-gradient-to-r before:from-primary/5 before:to-secondary/5
                 before:pointer-events-none animate-in fade-in-50 zoom-in-95"
        align="end" 
        forceMount
      >
        <div className="px-2 pt-2 pb-1">
          <DropdownMenuLabel className="text-primary font-heading">
            My Account
          </DropdownMenuLabel>
          
          <p className="text-xs text-foreground/70 ml-2 mb-1 truncate">
            {user?.email}
          </p>
          
          <div className="flex flex-wrap gap-1 ml-2 mb-2">
            {roles.map(getRoleBadge)}
          </div>
        </div>
        
        <DropdownMenuSeparator className="bg-primary/10" />
        
        <DropdownMenuItem asChild className="group">
          <Link to="/profile" className="flex items-center cursor-pointer">
            <User className="mr-2 h-4 w-4 text-primary group-hover:animate-pulse" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="group">
          <Link to="/settings" className="flex items-center cursor-pointer">
            <Settings className="mr-2 h-4 w-4 text-primary group-hover:animate-pulse" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        
        {hasAdminAccess && (
          <DropdownMenuItem asChild className="group">
            <Link to="/admin" className="flex items-center cursor-pointer">
              <Shield className="mr-2 h-4 w-4 text-primary group-hover:animate-pulse" />
              <span>Admin Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator className="bg-primary/10" />
        
        <div className="px-2 py-1.5">
          <p className="text-xs text-foreground/60 ml-2 mb-1">Connected Accounts</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 py-1 rounded-md text-xs bg-background/40">
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-primary/70" />
                <span>Email</span>
              </div>
              <Badge variant="outline" className="h-5 px-1 text-xs border-green-500/30 text-green-500">
                Connected
              </Badge>
            </div>
            
            <div className="flex items-center justify-between px-2 py-1 rounded-md text-xs bg-background/40">
              <div className="flex items-center gap-2">
                <Github className="h-3 w-3 text-foreground/70" />
                <span>GitHub</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 px-1.5 text-xs hover:bg-primary/10"
                onClick={handleLinkGoogle}
                disabled={isLinkingGoogle}
              >
                <LinkIcon className="h-3 w-3 mr-1" />
                Link
              </Button>
            </div>
          </div>
        </div>
        
        <DropdownMenuSeparator className="bg-primary/10" />
        
        <DropdownMenuItem 
          disabled={isLoading} 
          onClick={handleLogout}
          className="text-red-500 hover:text-red-400 focus:bg-red-500/10 hover:bg-red-500/10"
        >
          {isLoading ? (
            <>
              <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
              <span>Logging out...</span>
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
