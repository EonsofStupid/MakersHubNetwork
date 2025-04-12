
// Component-related shared types

export interface AdminLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export interface NavigationItemType {
  title: string;
  href: string;
  icon?: React.ReactNode;
  requiredPermission?: string;
  badge?: string;
  children?: NavigationItemType[];
}
