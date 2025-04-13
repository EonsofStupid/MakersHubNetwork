
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
        "px-3 py-2 text-sm font-medium transition-colors relative",
        "hover:text-primary group",
        isActive 
          ? "text-primary" 
          : "text-muted-foreground"
      )}
    >
      <div className="flex items-center gap-2">
        {icon && <span>{icon}</span>}
        <span>{label}</span>
      </div>
      
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
      )}
      
      {/* Bottom glow effect on hover */}
      <span className="absolute bottom-0 left-0 w-full h-0.5 scale-x-0 group-hover:scale-x-100 bg-primary/40 transition-transform duration-300" />
    </Link>
  );
};

export default TopNavItem;
