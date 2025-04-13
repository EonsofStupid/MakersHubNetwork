
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserMenu } from '@/auth/components/UserMenu';
import { TopNavItem } from './TopNavItem';
import { RBACBridge } from '@/rbac/bridge';
import { Button } from '@/shared/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

const AdminTopNav: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBackToMain = () => {
    navigate('/');
  };

  // Check if user is a super admin
  const isSuperAdmin = RBACBridge.isSuperAdmin();

  return (
    <nav className={cn(
      "flex items-center justify-between px-4 h-16 border-b border-b-primary/20",
      "bg-background/60 backdrop-blur-lg sticky top-0 z-10"
    )}>
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBackToMain}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Site</span>
        </Button>
        
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-primary mr-2" />
          <h1 className="text-lg font-semibold">Admin Portal</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex">
          <TopNavItem to="/admin/dashboard" label="Dashboard" />
          <TopNavItem to="/admin/users" label="Users" />
          <TopNavItem to="/admin/content" label="Content" />
          {isSuperAdmin && <TopNavItem to="/admin/settings" label="Settings" />}
        </div>
        
        <UserMenu />
      </div>
    </nav>
  );
};

export default AdminTopNav;
