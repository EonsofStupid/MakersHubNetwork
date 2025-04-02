
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number | string }>;

// Export all the Lucide icons directly
export const Icons: Record<string, IconComponent> = {
  // Application UI icons
  logo: LucideIcons.Atom,
  close: LucideIcons.X,
  menu: LucideIcons.Menu,
  billing: LucideIcons.CreditCard,
  
  // User-related icons
  user: LucideIcons.User,
  logout: LucideIcons.LogOut,
  login: LucideIcons.LogIn,
  profile: LucideIcons.User,
  
  // Status icons
  spinner: LucideIcons.Loader,
  check: LucideIcons.Check,
  warning: LucideIcons.AlertTriangle,
  error: LucideIcons.XCircle,
  info: LucideIcons.Info,
  success: LucideIcons.CheckCircle,
  
  // Navigation icons
  arrowLeft: LucideIcons.ArrowLeft,
  arrowRight: LucideIcons.ArrowRight,
  chevronLeft: LucideIcons.ChevronLeft,
  chevronRight: LucideIcons.ChevronRight,
  
  // Admin & dashboard icons
  dashboard: LucideIcons.LayoutDashboard,
  users: LucideIcons.Users,
  analytics: LucideIcons.BarChart,
  content: LucideIcons.FileText,
  database: LucideIcons.Database,
  cpu: LucideIcons.Cpu,
  gauge: LucideIcons.Gauge,
  refresh: LucideIcons.RefreshCcw,
  loader: LucideIcons.Loader,
  settings: LucideIcons.Settings,
  
  // Make all Lucide icons available too
  ...Object.entries(LucideIcons).reduce((acc, [name, icon]) => {
    acc[name] = icon as IconComponent;
    return acc;
  }, {} as Record<string, IconComponent>)
};

/**
 * Simplified icon component for dynamic icon loading by name
 */
export function DynamicIcon({ 
  name, 
  className, 
  size = 24,
  ...props 
}: { 
  name: string; 
  className?: string;
  size?: number;
  [key: string]: any;
}) {
  // Ensure we have a valid icon name
  if (!name || typeof name !== 'string') {
    console.warn(`Invalid icon name provided: ${name}`);
    return <LucideIcons.HelpCircle className={className} size={size} {...props} />;
  }

  // Try to find the icon component
  const IconComponent = Icons[name as keyof typeof Icons] as React.ComponentType<LucideProps>;
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found, using fallback`);
    return <LucideIcons.HelpCircle className={className} size={size} {...props} />;
  }
  
  // Return the icon component with proper props
  return <IconComponent className={className} size={size} {...props} />;
}
