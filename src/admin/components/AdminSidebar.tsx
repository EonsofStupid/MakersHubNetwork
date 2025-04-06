
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Settings, Users, FileText, 
  Layers, Package, PanelLeft, X 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAdminTheme } from '@/admin/theme/AdminThemeProvider';

interface AdminSidebarProps {
  open: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ open, onToggle }: AdminSidebarProps) {
  const { theme } = useAdminTheme();
  
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-[var(--impulse-bg-card)] border-r border-[var(--impulse-border-normal)] transform transition-transform duration-200 ease-in-out md:relative",
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--impulse-border-normal)]">
        <div className="flex items-center">
          <span className="text-lg font-semibold text-[var(--impulse-text-accent)]">Admin Panel</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggle} className="md:hidden">
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <nav className="p-4 space-y-1">
        <SidebarLink to="/admin" icon={<Home />} label="Dashboard" />
        <SidebarLink to="/admin/content" icon={<FileText />} label="Content" />
        <SidebarLink to="/admin/users" icon={<Users />} label="Users" />
        <SidebarLink to="/admin/settings/account" icon={<Settings />} label="Settings" />
        <SidebarLink to="/admin/themes" icon={<Layers />} label="Themes" />
        <SidebarLink to="/admin/components" icon={<Package />} label="Components" />
        <SidebarLink to="/admin/layout" icon={<PanelLeft />} label="Layout" />
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-[var(--impulse-border-normal)]">
        <NavLink to="/" className="text-sm text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-text-accent)]">
          ← Back to Site
        </NavLink>
      </div>
    </div>
  );
}

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

function SidebarLink({ to, icon, label }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center px-4 py-2 rounded-md text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-text-accent)] hover:bg-[var(--impulse-bg-overlay)] transition-colors",
        isActive && "bg-[var(--impulse-bg-overlay)] text-[var(--impulse-text-accent)] border-l-2 border-[var(--impulse-primary)]"
      )}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}
