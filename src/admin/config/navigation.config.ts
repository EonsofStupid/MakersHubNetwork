
import {
  Home,
  Users,
  Database,
  Settings,
  Layout,
  Layers,
  Paintbrush,
  FileText,
  Shield,
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
  Star,
  BookOpen,
  Bell,
  Code,
  Server,
  Zap,
  BookMarked,
  Store,
  Boxes,
  LayoutDashboard,
  Truck,
  PencilRuler,
  PieChart,
  Grid,
  Monitor,
  Terminal,
  Palette,
  GitBranch,
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
  keywords?: string[];
}

export const adminNavigationItems: AdminNavigationItem[] = [
  // General section
  {
    id: 'overview',
    label: 'Overview',
    description: 'Admin dashboard overview',
    icon: LayoutDashboard,
    path: '/admin/overview',
    section: 'General',
    keywords: ['dashboard', 'home', 'main', 'overview']
  },
  
  // Content Management section
  {
    id: 'content',
    label: 'Content',
    description: 'Manage content and pages',
    icon: FileText,
    path: '/admin/content',
    section: 'Management',
    permission: AdminPermissions.CONTENT_EDIT,
    keywords: ['content', 'pages', 'articles', 'blog']
  },
  {
    id: 'media',
    label: 'Media',
    description: 'Manage media library',
    icon: Image,
    path: '/admin/media',
    section: 'Management',
    permission: AdminPermissions.CONTENT_EDIT,
    keywords: ['media', 'images', 'videos', 'files']
  },
  
  // User Management section
  {
    id: 'users',
    label: 'Users',
    description: 'Manage user accounts',
    icon: Users,
    path: '/admin/users',
    section: 'Management',
    permission: AdminPermissions.USERS_VIEW,
    keywords: ['users', 'accounts', 'members', 'profiles']
  },
  {
    id: 'permissions',
    label: 'Permissions',
    description: 'Manage user permissions',
    icon: ShieldCheck,
    path: '/admin/permissions',
    section: 'Management',
    permission: AdminPermissions.SUPER_ADMIN,
    keywords: ['permissions', 'roles', 'access']
  },
  
  // Products Management section
  {
    id: 'builds',
    label: 'Builds',
    description: 'Manage 3D printer builds',
    icon: Package,
    path: '/admin/builds',
    section: 'Products',
    permission: AdminPermissions.BUILDS_VIEW,
    keywords: ['builds', 'products', '3d printers']
  },
  {
    id: 'parts',
    label: 'Parts',
    description: 'Manage 3D printer parts',
    icon: Boxes,
    path: '/admin/parts',
    section: 'Products',
    keywords: ['parts', 'components', 'accessories']
  },
  {
    id: 'designs',
    label: 'Designs',
    description: 'Manage 3D designs',
    icon: PencilRuler,
    path: '/admin/designs',
    section: 'Products',
    keywords: ['designs', 'models', '3d files']
  },
  {
    id: 'store',
    label: 'Store',
    description: 'Manage store items',
    icon: Store,
    path: '/admin/store',
    section: 'Products',
    keywords: ['store', 'shop', 'marketplace']
  },
  {
    id: 'orders',
    label: 'Orders',
    description: 'Manage customer orders',
    icon: Truck,
    path: '/admin/orders',
    section: 'Products',
    keywords: ['orders', 'shipping', 'delivery']
  },
  
  // Content Engagement section
  {
    id: 'reviews',
    label: 'Reviews',
    description: 'Manage user reviews',
    icon: Star,
    path: '/admin/reviews',
    section: 'Engagement',
    permission: AdminPermissions.REVIEWS_MANAGE,
    keywords: ['reviews', 'ratings', 'feedback']
  },
  {
    id: 'comments',
    label: 'Comments',
    description: 'Manage user comments',
    icon: MessageSquare,
    path: '/admin/comments',
    section: 'Engagement',
    keywords: ['comments', 'discussions', 'threads']
  },
  {
    id: 'messaging',
    label: 'Messaging',
    description: 'Platform messaging system',
    icon: Mail,
    path: '/admin/messaging',
    section: 'Engagement',
    permission: AdminPermissions.MESSAGING_ACCESS,
    keywords: ['messaging', 'chat', 'email', 'communication']
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Manage system notifications',
    icon: Bell,
    path: '/admin/notifications',
    section: 'Engagement',
    keywords: ['notifications', 'alerts', 'announcements']
  },
  
  // Analytics section
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'View platform analytics',
    icon: BarChart,
    path: '/admin/analytics',
    section: 'Analytics',
    permission: AdminPermissions.ANALYTICS_VIEW,
    keywords: ['analytics', 'statistics', 'metrics', 'insights']
  },
  {
    id: 'reports',
    label: 'Reports',
    description: 'Generate custom reports',
    icon: PieChart,
    path: '/admin/reports',
    section: 'Analytics',
    keywords: ['reports', 'exports', 'data']
  },
  
  // Customization section
  {
    id: 'themes',
    label: 'Themes',
    description: 'Manage platform themes',
    icon: Palette,
    path: '/admin/themes',
    section: 'Customization',
    permission: AdminPermissions.THEMES_VIEW,
    keywords: ['themes', 'appearance', 'styles', 'colors']
  },
  {
    id: 'layouts',
    label: 'Layouts',
    description: 'Manage page layouts',
    icon: Layout,
    path: '/admin/layouts',
    section: 'Customization',
    permission: AdminPermissions.LAYOUTS_VIEW,
    keywords: ['layouts', 'templates', 'structure']
  },
  {
    id: 'components',
    label: 'Components',
    description: 'Manage UI components',
    icon: Blocks,
    path: '/admin/components',
    section: 'Customization',
    permission: AdminPermissions.SUPER_ADMIN,
    keywords: ['components', 'ui', 'elements', 'widgets']
  },
  
  // Advanced section
  {
    id: 'data-maestro',
    label: 'Data Maestro',
    description: 'Manage platform data',
    icon: Database,
    path: '/admin/data-maestro',
    section: 'Advanced',
    permission: AdminPermissions.DATA_VIEW,
    keywords: ['data', 'database', 'imports', 'exports']
  },
  {
    id: 'workflows',
    label: 'Workflows',
    description: 'Manage automation workflows',
    icon: Workflow,
    path: '/admin/workflows',
    section: 'Advanced',
    permission: AdminPermissions.WORKFLOWS_VIEW,
    keywords: ['workflows', 'automation', 'rules']
  },
  {
    id: 'api',
    label: 'API',
    description: 'Manage API settings',
    icon: Code,
    path: '/admin/api',
    section: 'Advanced',
    keywords: ['api', 'integrations', 'endpoints']
  },
  {
    id: 'developer',
    label: 'Developer',
    description: 'Developer tools',
    icon: Terminal,
    path: '/admin/developer',
    section: 'Advanced',
    permission: AdminPermissions.SUPER_ADMIN,
    keywords: ['developer', 'tools', 'logs', 'debug']
  },
  
  // System section
  {
    id: 'performance',
    label: 'Performance',
    description: 'Monitor system performance',
    icon: Zap,
    path: '/admin/performance',
    section: 'System',
    keywords: ['performance', 'speed', 'optimization']
  },
  {
    id: 'security',
    label: 'Security',
    description: 'Manage security settings',
    icon: Shield,
    path: '/admin/security',
    section: 'System',
    keywords: ['security', 'protection', 'privacy']
  },
  {
    id: 'updates',
    label: 'Updates',
    description: 'Manage system updates',
    icon: GitBranch,
    path: '/admin/updates',
    section: 'System',
    keywords: ['updates', 'versions', 'changelog']
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Admin settings',
    icon: Settings,
    path: '/admin/settings',
    section: 'System',
    permission: AdminPermissions.SETTINGS_VIEW,
    keywords: ['settings', 'configuration', 'options', 'preferences']
  },
  
  // Help and Support section
  {
    id: 'docs',
    label: 'Documentation',
    description: 'Admin documentation',
    icon: BookOpen,
    path: '/admin/docs',
    section: 'Help',
    keywords: ['docs', 'documentation', 'guides', 'help']
  },
  {
    id: 'help',
    label: 'Help Center',
    description: 'Get help and support',
    icon: HelpCircle,
    path: '/admin/help',
    section: 'Help',
    keywords: ['help', 'support', 'assistance', 'faq']
  }
];
