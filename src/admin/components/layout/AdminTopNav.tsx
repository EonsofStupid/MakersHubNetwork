import React from 'react';
import { useAdminStore } from '../../store/admin.store';
import { SyncIndicator } from '@/components/admin/SyncIndicator';
import { Bell, User, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminTopNavProps {
  title?: string;
  className?: string;
}

export function AdminTopNav({ title = "Admin Dashboard", className }: AdminTopNavProps) {
  const { sidebarExpanded, toggleSidebar } = useAdminStore();
  
  return (
    <div className={`admin-topnav border-b border-border/20 bg-card/30 backdrop-blur-md h-14 fixed top-0 left-0 right-0 z-30 ${className}`}>
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="text-foreground hover:text-primary transition-colors"
          >
            <Menu size={20} />
          </Button>
          
          <Link to="/admin" className="text-foreground hover:text-primary transition-colors">
            <h1 className="text-lg font-bold">{title}</h1>
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="mr-4">
            <SyncIndicator />
          </div>
          
          <Button variant="ghost" size="icon" className="text-foreground hover:text-primary transition-colors">
            <Bell size={20} />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-foreground hover:text-primary transition-colors">
            <Settings size={20} />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-foreground hover:text-primary transition-colors">
            <User size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
