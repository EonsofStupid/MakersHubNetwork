
import React from 'react';
import * as LucideIcons from 'lucide-react';

// Export all the Lucide icons directly
export const Icons = {
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
    // @ts-ignore - We're dynamically creating the object here
    acc[name] = icon;
    return acc;
  }, {} as Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>>)
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
  const IconComponent = Icons[name as keyof typeof Icons] || LucideIcons.HelpCircle;
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found, using fallback`);
    return <LucideIcons.HelpCircle className={className} size={size} {...props} />;
  }
  
  return <IconComponent className={className} size={size} {...props} />;
}
