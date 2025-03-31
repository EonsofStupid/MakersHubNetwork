
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
  permission?: string;
}

export const adminNavigationItems: AdminNavigationItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'Admin dashboard overview',
    icon: Home,
    path: '/admin/overview'
  },
  {
    id: 'users',
    label: 'Users',
    description: 'Manage user accounts',
    icon: Users,
    path: '/admin/users',
    permission: AdminPermissions.USERS_VIEW
  },
  {
    id: 'content',
    label: 'Content',
    description: 'Manage content and pages',
    icon: FileText,
    path: '/admin/content',
    permission: AdminPermissions.CONTENT_EDIT
  },
  {
    id: 'data-maestro',
    label: 'Data Maestro',
    description: 'Manage platform data',
    icon: Database,
    path: '/admin/data-maestro',
    permission: AdminPermissions.DATA_VIEW
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'View platform analytics',
    icon: BarChart,
    path: '/admin/analytics',
    permission: AdminPermissions.ANALYTICS_VIEW
  },
  {
    id: 'permissions',
    label: 'Permissions',
    description: 'Manage user permissions',
    icon: ShieldCheck,
    path: '/admin/permissions',
    permission: AdminPermissions.SUPER_ADMIN
  },
  {
    id: 'messaging',
    label: 'Messaging',
    description: 'Platform messaging system',
    icon: MessageSquare,
    path: '/admin/messaging',
    permission: AdminPermissions.MESSAGING_ACCESS
  },
  {
    id: 'themes',
    label: 'Themes',
    description: 'Manage platform themes',
    icon: Paintbrush,
    path: '/admin/themes',
    permission: AdminPermissions.THEMES_VIEW
  },
  {
    id: 'layouts',
    label: 'Layouts',
    description: 'Manage page layouts',
    icon: Layout,
    path: '/admin/layouts',
    permission: AdminPermissions.LAYOUTS_VIEW
  },
  {
    id: 'builds',
    label: 'Builds',
    description: 'Manage 3D printer builds',
    icon: Package,
    path: '/admin/builds',
    permission: AdminPermissions.BUILDS_VIEW
  },
  {
    id: 'workflows',
    label: 'Workflows',
    description: 'Manage automation workflows',
    icon: Workflow,
    path: '/admin/workflows',
    permission: AdminPermissions.WORKFLOWS_VIEW
  },
  {
    id: 'reviews',
    label: 'Reviews',
    description: 'Manage user reviews',
    icon: Eye,
    path: '/admin/reviews',
    permission: AdminPermissions.REVIEWS_MANAGE
  },
  {
    id: 'components',
    label: 'Components',
    description: 'Manage UI components',
    icon: Blocks,
    path: '/admin/components',
    permission: AdminPermissions.SUPER_ADMIN
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Admin settings',
    icon: Settings,
    path: '/admin/settings',
    permission: AdminPermissions.SETTINGS_VIEW
  },
];
