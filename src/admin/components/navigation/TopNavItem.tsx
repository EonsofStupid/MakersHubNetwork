
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';

interface TopNavItemProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
}

export const TopNavItem: React.FC<TopNavItemProps> = ({ to, label, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <Link
      to={to}
      className={cn(
        "px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "text-primary" 
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <div className="flex items-center gap-2">
        {icon && icon}
        {label}
      </div>
    </Link>
  );
};
