
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Package, 
  FileText, 
  BarChart, 
  ShieldAlert,
  Bell,
  Heart,
  Database,
  Code,
  Briefcase,
  MessageSquare,
  MegaphoneSimple,
  Map,
  LucideIcon
} from 'lucide-react';

export interface AdminNavigationItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  section?: string;
  permission?: string;
}

export const adminNavigationItems: AdminNavigationItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    path: '/admin/overview',
    icon: LayoutDashboard,
    section: 'General'
  },
  {
    id: 'users',
    label: 'Users',
    path: '/admin/users',
    icon: Users,
    section: 'General',
    permission: 'read:users'
  },
  {
    id: 'builds',
    label: 'Builds',
    path: '/admin/builds',
    icon: Package,
    section: 'Content'
  },
  {
    id: 'content',
    label: 'Content',
    path: '/admin/content',
    icon: FileText,
    section: 'Content'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/admin/analytics',
    icon: BarChart,
    section: 'Reports'
  },
  {
    id: 'security',
    label: 'Security',
    path: '/admin/security',
    icon: ShieldAlert,
    section: 'Settings',
    permission: 'read:security'
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/admin/settings',
    icon: Settings,
    section: 'Settings'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    path: '/admin/notifications',
    icon: Bell,
    section: 'Communication'
  },
  {
    id: 'community',
    label: 'Community',
    path: '/admin/community',
    icon: Heart,
    section: 'Communication'
  },
  {
    id: 'database',
    label: 'Database',
    path: '/admin/database',
    icon: Database,
    section: 'Developer',
    permission: 'read:database'
  },
  {
    id: 'code',
    label: 'Code',
    path: '/admin/code',
    icon: Code,
    section: 'Developer',
    permission: 'read:code'
  },
  {
    id: 'jobs',
    label: 'Jobs',
    path: '/admin/jobs',
    icon: Briefcase,
    section: 'Management'
  },
  {
    id: 'messages',
    label: 'Messages',
    path: '/admin/messages',
    icon: MessageSquare,
    section: 'Communication'
  },
  {
    id: 'marketing',
    label: 'Marketing',
    path: '/admin/marketing',
    icon: MegaphoneSimple,
    section: 'Management'
  },
  {
    id: 'locations',
    label: 'Locations',
    path: '/admin/locations',
    icon: Map,
    section: 'Management'
  }
];
