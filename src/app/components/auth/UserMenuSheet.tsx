
import React from "react";
import { UserRole, ROLE_LABELS } from "@/rbac/constants/roles";
import { RBACBridge } from "@/rbac/bridge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/shared/ui/sheet";
import { Button } from "@/shared/ui/button";
import { 
  LogOut, 
  User, 
  Settings, 
  Users, 
  Shield, 
  FileText, 
  Database,
  LayoutDashboard
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserMenuSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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
  roles,
}) => {
  const navigate = useNavigate();
  const isAdmin = RBACBridge.hasAdminAccess();
  const isSuperAdmin = RBACBridge.isSuperAdmin();
  const isModerator = RBACBridge.isModerator();

  const adminLinks = [
    { 
      label: "Dashboard", 
      icon: <LayoutDashboard className="w-4 h-4" />, 
      path: "/admin",
      roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN]
    },
    { 
      label: "Users", 
      icon: <Users className="w-4 h-4" />, 
      path: "/admin/users",
      roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN]
    },
    { 
      label: "Content", 
      icon: <FileText className="w-4 h-4" />, 
      path: "/admin/content",
      roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR]
    },
    { 
      label: "Database", 
      icon: <Database className="w-4 h-4" />, 
      path: "/admin/database",
      roles: [UserRole.SUPER_ADMIN]
    },
    { 
      label: "Settings", 
      icon: <Settings className="w-4 h-4" />, 
      path: "/admin/settings",
      roles: [UserRole.SUPER_ADMIN]
    }
  ];

  const hasAccess = (requiredRoles: UserRole[]) => {
    return RBACBridge.hasRole(requiredRoles);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Account</SheetTitle>
        </SheetHeader>
        
        <div className="py-4 flex flex-col items-center text-center">
          <div className="relative w-16 h-16 rounded-full overflow-hidden mb-2 bg-primary flex items-center justify-center text-white text-xl">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userDisplayName}
                className="w-full h-full object-cover"
              />
            ) : (
              userDisplayName.charAt(0).toUpperCase()
            )}
          </div>
          
          <h3 className="font-medium text-lg">{userDisplayName}</h3>
          <p className="text-muted-foreground text-sm">{userEmail}</p>
          
          {roles.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1 justify-center">
              {roles.map((role) => (
                <span
                  key={role}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                >
                  {ROLE_LABELS[role] || role}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-3 mt-4">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={onShowProfile}
          >
            <User className="mr-2 h-4 w-4" />
            Your Profile
          </Button>

          {(isAdmin || isModerator) && (
            <div className="pt-2 space-y-2 border-t">
              <p className="text-xs font-medium text-muted-foreground pl-2">
                Admin Access
              </p>
              {adminLinks.map((link) => 
                hasAccess(link.roles) && (
                  <Button
                    key={link.path}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate(link.path)}
                  >
                    {link.icon}
                    <span className="ml-2">{link.label}</span>
                  </Button>
                )
              )}
            </div>
          )}
        </div>
        
        <SheetFooter className="absolute bottom-4 left-4 right-4">
          <Button 
            variant="outline" 
            className="w-full border-destructive text-destructive hover:bg-destructive/10"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
