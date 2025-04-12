
import React from "react";
import { useAdminSidebar } from "../hooks/useAdminSidebar";
import { cn } from "@/shared/utils/cn";
import { adminNavigation } from "../config/navigation.config";
import { Link, useLocation } from "react-router-dom";
import { useAdminStore } from "../store/admin.store";

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const { isOpen } = useAdminSidebar();
  const location = useLocation();
  const hasRole = useAdminStore((state) => state.hasRole);

  // Filter navigation items based on user roles
  const filteredNavigation = adminNavigation.filter(item => {
    if (!item.requiredRole) return true;
    return hasRole(item.requiredRole);
  });

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-20 h-full w-64 transform border-r border-border/40 bg-background transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:relative lg:translate-x-0",
        className
      )}
    >
      <div className="flex h-16 items-center border-b border-border/40 px-4">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold">A</span>
          </div>
          <span className="text-lg font-semibold">Admin</span>
        </Link>
      </div>

      <nav className="space-y-1 p-2">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href || 
                          location.pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
              )}
            >
              {Icon && <Icon className="h-5 w-5" />}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
