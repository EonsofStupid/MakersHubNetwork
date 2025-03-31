
import {
  Home,
  Users,
  Database,
  Settings,
  Layout,
  Layers,
  Paintbrush,
  FileText,
  ShieldCheck,
  LineChart,
  Package,
  Blocks,
  Crown,
  Bot,
  Workflow,
  Mail,
  Image,
  MessageSquare,
  Video,
  Send,
  Building,
  Lightbulb,
  Upload,
  Search,
  CircleUser,
  Info,
  BarChart,
  Eye,
  Flag,
  Globe,
  HelpCircle,
} from 'lucide-react';
import { AdminPermissions } from '@/admin/constants/permissions';

export interface AdminNavigationItem {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  section: string; // Explicit section property
  permission?: string;
}

export const adminNavigationItems: AdminNavigationItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'Admin dashboard overview',
    icon: Home,
    path: '/admin/overview',
    section: 'General'
  },
  {
    id: 'users',
    label: 'Users',
    description: 'Manage user accounts',
    icon: Users,
    path: '/admin/users',
    section: 'Management',
    permission: AdminPermissions.USERS_VIEW
  },
  {
    id: 'content',
    label: 'Content',
    description: 'Manage content and pages',
    icon: FileText,
    path: '/admin/content',
    section: 'Management',
    permission: AdminPermissions.CONTENT_EDIT
  },
  {
    id: 'data-maestro',
    label: 'Data Maestro',
    description: 'Manage platform data',
    icon: Database,
    path: '/admin/data-maestro',
    section: 'Advanced',
    permission: AdminPermissions.DATA_VIEW
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'View platform analytics',
    icon: BarChart,
    path: '/admin/analytics',
    section: 'Resources',
    permission: AdminPermissions.ANALYTICS_VIEW
  },
  {
    id: 'permissions',
    label: 'Permissions',
    description: 'Manage user permissions',
    icon: ShieldCheck,
    path: '/admin/permissions',
    section: 'System',
    permission: AdminPermissions.SUPER_ADMIN
  },
  {
    id: 'messaging',
    label: 'Messaging',
    description: 'Platform messaging system',
    icon: MessageSquare,
    path: '/admin/messaging',
    section: 'Communications',
    permission: AdminPermissions.MESSAGING_ACCESS
  },
  {
    id: 'themes',
    label: 'Themes',
    description: 'Manage platform themes',
    icon: Paintbrush,
    path: '/admin/themes',
    section: 'Resources',
    permission: AdminPermissions.THEMES_VIEW
  },
  {
    id: 'layouts',
    label: 'Layouts',
    description: 'Manage page layouts',
    icon: Layout,
    path: '/admin/layouts',
    section: 'Resources',
    permission: AdminPermissions.LAYOUTS_VIEW
  },
  {
    id: 'builds',
    label: 'Builds',
    description: 'Manage 3D printer builds',
    icon: Package,
    path: '/admin/builds',
    section: 'Management',
    permission: AdminPermissions.BUILDS_VIEW
  },
  {
    id: 'workflows',
    label: 'Workflows',
    description: 'Manage automation workflows',
    icon: Workflow,
    path: '/admin/workflows',
    section: 'Advanced',
    permission: AdminPermissions.WORKFLOWS_VIEW
  },
  {
    id: 'reviews',
    label: 'Reviews',
    description: 'Manage user reviews',
    icon: Eye,
    path: '/admin/reviews',
    section: 'Management',
    permission: AdminPermissions.REVIEWS_MANAGE
  },
  {
    id: 'components',
    label: 'Components',
    description: 'Manage UI components',
    icon: Blocks,
    path: '/admin/components',
    section: 'Advanced',
    permission: AdminPermissions.SUPER_ADMIN
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Admin settings',
    icon: Settings,
    path: '/admin/settings',
    section: 'System',
    permission: AdminPermissions.SETTINGS_VIEW
  },
];
