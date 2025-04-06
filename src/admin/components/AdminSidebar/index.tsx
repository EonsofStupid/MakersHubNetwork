
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  ChevronRight,
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Box,
  MessageSquare,
  Layers,
  BarChart,
} from 'lucide-react';

export interface AdminSidebarProps {
  open: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ open, onToggle }: AdminSidebarProps) {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={cn(
        "h-screen bg-background border-r border-border transition-all duration-300 flex flex-col",
        open ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center h-16 px-4 border-b border-border">
        <button
          onClick={onToggle}
          className="ml-auto rounded-md p-1 hover:bg-accent"
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              open ? "rotate-180" : ""
            )}
          />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <NavGroup title="Overview">
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            path="/admin"
            isActive={isActive("/admin")}
            expanded={open}
          />
          <NavItem
            icon={<BarChart size={18} />}
            label="Analytics"
            path="/admin/analytics"
            isActive={isActive("/admin/analytics")}
            expanded={open}
          />
        </NavGroup>

        <NavGroup title="Content">
          <NavItem
            icon={<FileText size={18} />}
            label="Pages"
            path="/admin/pages"
            isActive={isActive("/admin/pages")}
            expanded={open}
          />
          <NavItem
            icon={<Box size={18} />}
            label="Products"
            path="/admin/products"
            isActive={isActive("/admin/products")}
            expanded={open}
          />
        </NavGroup>

        <NavGroup title="Users">
          <NavItem
            icon={<Users size={18} />}
            label="User Management"
            path="/admin/users"
            isActive={isActive("/admin/users")}
            expanded={open}
          />
          <NavItem
            icon={<MessageSquare size={18} />}
            label="Comments"
            path="/admin/comments"
            isActive={isActive("/admin/comments")}
            expanded={open}
          />
        </NavGroup>

        <NavGroup title="System">
          <NavItem
            icon={<Layers size={18} />}
            label="Integrations"
            path="/admin/integrations"
            isActive={isActive("/admin/integrations")}
            expanded={open}
          />
          <NavItem
            icon={<Settings size={18} />}
            label="Settings"
            path="/admin/settings"
            isActive={isActive("/admin/settings")}
            expanded={open}
          />
        </NavGroup>
      </div>
    </aside>
  );
}

interface NavGroupProps {
  title: string;
  children: React.ReactNode;
}

function NavGroup({ title, children }: NavGroupProps) {
  return (
    <div className="mb-4">
      <h3 className="px-4 text-xs font-medium text-muted-foreground mb-2">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  expanded: boolean;
}

function NavItem({ icon, label, path, isActive, expanded }: NavItemProps) {
  return (
    <Link
      to={path}
      className={cn(
        "flex items-center px-4 py-2 text-sm",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
        !expanded && "justify-center"
      )}
    >
      {icon}
      {expanded && <span className="ml-3">{label}</span>}
    </Link>
  );
}
