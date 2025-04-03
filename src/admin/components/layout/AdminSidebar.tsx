
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Users,
  Settings,
  Layers,
  Palette,
  LayoutDashboard,
  FileText,
  Upload,
  Database,
  Package,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
}

function NavItem({ href, icon, title, isActive }: NavItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
      )}
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
}

interface NavGroupProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function NavGroup({ title, icon, children, defaultOpen = false }: NavGroupProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="flex w-full items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-medium">{title}</span>
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pl-4 pt-1">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function AdminSidebar() {
  const location = useLocation();
  
  // Simple helper to check if current path matches
  const isActivePath = (path: string) => {
    // Exact match or child path
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <div className="hidden w-64 flex-col border-r bg-background md:flex">
      <ScrollArea className="flex-1 py-2">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-tight">
            Dashboard
          </h2>
          <div className="space-y-1">
            <NavItem
              href="/admin"
              icon={<LayoutDashboard className="h-4 w-4" />}
              title="Overview"
              isActive={isActivePath('/admin') && location.pathname === '/admin'}
            />
          </div>
        </div>
        
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-tight">
            Content Management
          </h2>
          <div className="space-y-1">
            <NavItem
              href="/admin/content"
              icon={<FileText className="h-4 w-4" />}
              title="Content"
              isActive={isActivePath('/admin/content')}
            />
            <NavItem
              href="/admin/imports"
              icon={<Upload className="h-4 w-4" />}
              title="Imports"
              isActive={isActivePath('/admin/imports')}
            />
          </div>
        </div>

        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-tight">
            Product Management
          </h2>
          <div className="space-y-1">
            <NavGroup 
              title="Products" 
              icon={<Package className="h-4 w-4" />}
              defaultOpen={isActivePath('/admin/products')}
            >
              <NavItem
                href="/admin/products"
                icon={<Layers className="h-4 w-4" />}
                title="All Products"
                isActive={isActivePath('/admin/products') && location.pathname === '/admin/products'}
              />
              <NavItem
                href="/admin/products/categories"
                icon={<Database className="h-4 w-4" />}
                title="Categories"
                isActive={isActivePath('/admin/products/categories')}
              />
            </NavGroup>
          </div>
        </div>
        
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-tight">
            Appearance
          </h2>
          <div className="space-y-1">
            <NavItem
              href="/admin/themes"
              icon={<Palette className="h-4 w-4" />}
              title="Themes"
              isActive={isActivePath('/admin/themes')}
            />
          </div>
        </div>
        
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-tight">
            Administration
          </h2>
          <div className="space-y-1">
            <NavItem
              href="/admin/users"
              icon={<Users className="h-4 w-4" />}
              title="Users"
              isActive={isActivePath('/admin/users')}
            />
            <NavItem
              href="/admin/settings"
              icon={<Settings className="h-4 w-4" />}
              title="Settings"
              isActive={isActivePath('/admin/settings')}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
