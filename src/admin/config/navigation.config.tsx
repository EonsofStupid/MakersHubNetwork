
import React from 'react';
import { 
  LayoutDashboard, Users, Package, Star, Settings, 
  FileText, Palette, Database, Bell, Shield, Zap,
  Image, BarChart, HelpCircle, Book, Terminal,
  MessageSquare, Mail, GitBranch
} from 'lucide-react';
import { AdminPermissionValue, ADMIN_PERMISSIONS } from '@/admin/constants/permissions';

export interface AdminNavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  section: string;  // Ensure section is defined and required
  permission?: AdminPermissionValue;
  description?: string;
  keywords?: string[];
}

export const adminNavigationItems: AdminNavigationItem[] = [
  // Dashboard section
  {
    id: 'overview',
    label: 'Dashboard',
    path: '/admin/overview',
    icon: LayoutDashboard,
    section: 'General',
    description: 'Overview of your platform activity',
    keywords: ['dashboard', 'overview', 'stats', 'metrics']
  },
  
  // User management section
  {
    id: 'users',
    label: 'Users',
    path: '/admin/users',
    icon: Users,
    section: 'Management',
    permission: ADMIN_PERMISSIONS.USERS_VIEW,
    description: 'Manage user accounts',
    keywords: ['users', 'accounts', 'members', 'profiles']
  },
  
  // Content management
  {
    id: 'content',
    label: 'Content',
    path: '/admin/content',
    icon: FileText,
    section: 'Management',
    permission: ADMIN_PERMISSIONS.CONTENT_VIEW,
    description: 'Manage site content',
    keywords: ['content', 'pages', 'articles', 'posts']
  },
  
  // Build management
  {
    id: 'builds',
    label: 'Builds',
    path: '/admin/builds',
    icon: Package,
    section: 'Management',
    permission: ADMIN_PERMISSIONS.BUILDS_VIEW,
    description: 'Manage 3D printer builds',
    keywords: ['builds', 'printers', 'projects', 'maker']
  },
  
  // Reviews management
  {
    id: 'reviews',
    label: 'Reviews',
    path: '/admin/reviews',
    icon: Star,
    section: 'Management',
    permission: ADMIN_PERMISSIONS.REVIEWS_VIEW,
    description: 'Manage user reviews',
    keywords: ['reviews', 'ratings', 'comments', 'feedback']
  },
  
  // Media management
  {
    id: 'media',
    label: 'Media',
    path: '/admin/media',
    icon: Image,
    section: 'Resources',
    permission: 'content:view',
    description: 'Manage images and media',
    keywords: ['images', 'photos', 'media', 'files', 'uploads']
  },
  
  // Analytics
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/admin/analytics',
    icon: BarChart,
    section: 'Resources',
    permission: 'admin:view',
    description: 'Platform analytics and insights',
    keywords: ['analytics', 'stats', 'metrics', 'charts', 'reports']
  },
  
  // Database management
  {
    id: 'data-maestro',
    label: 'Data Maestro',
    path: '/admin/data-maestro',
    icon: Database,
    section: 'Advanced',
    permission: 'admin:manage',
    description: 'Database management tools',
    keywords: ['database', 'data', 'records', 'tables']
  },
  
  // Themes
  {
    id: 'themes',
    label: 'Themes',
    path: '/admin/themes',
    icon: Palette,
    section: 'Advanced',
    permission: 'themes:view',
    description: 'Customize site appearance',
    keywords: ['themes', 'colors', 'design', 'styles', 'customize']
  },
  
  // Developer tools
  {
    id: 'developer',
    label: 'Developer',
    path: '/admin/developer',
    icon: Terminal,
    section: 'Advanced',
    permission: 'admin:manage',
    description: 'Developer tools and options',
    keywords: ['developer', 'code', 'api', 'debug']
  },
  
  // Notifications
  {
    id: 'notifications',
    label: 'Notifications',
    path: '/admin/notifications',
    icon: Bell,
    section: 'Communications',
    permission: 'admin:view',
    description: 'Manage site notifications',
    keywords: ['notifications', 'alerts', 'messages']
  },
  
  // Messaging
  {
    id: 'messaging',
    label: 'Messaging',
    path: '/admin/messaging',
    icon: MessageSquare,
    section: 'Communications',
    permission: 'admin:view',
    description: 'Platform messaging system',
    keywords: ['messaging', 'chat', 'messages', 'communication']
  },
  
  // Email campaigns
  {
    id: 'campaigns',
    label: 'Campaigns',
    path: '/admin/campaigns',
    icon: Mail,
    section: 'Communications',
    permission: 'admin:view',
    description: 'Email and marketing campaigns',
    keywords: ['email', 'campaigns', 'marketing', 'newsletter']
  },
  
  // Security
  {
    id: 'security',
    label: 'Security',
    path: '/admin/security',
    icon: Shield,
    section: 'System',
    permission: 'admin:manage',
    description: 'Security settings and logs',
    keywords: ['security', 'protection', 'logs', 'access']
  },
  
  // Performance
  {
    id: 'performance',
    label: 'Performance',
    path: '/admin/performance',
    icon: Zap,
    section: 'System',
    permission: 'admin:manage',
    description: 'Platform performance settings',
    keywords: ['performance', 'speed', 'optimization', 'caching']
  },
  
  // System updates
  {
    id: 'updates',
    label: 'Updates',
    path: '/admin/updates',
    icon: GitBranch,
    section: 'System',
    permission: 'admin:manage',
    description: 'Platform update management',
    keywords: ['updates', 'versions', 'upgrades', 'changelog']
  },
  
  // Help and documentation
  {
    id: 'help',
    label: 'Help',
    path: '/admin/help',
    icon: HelpCircle,
    section: 'Support',
    description: 'Help and support resources',
    keywords: ['help', 'support', 'assistance', 'guide']
  },
  
  // Documentation
  {
    id: 'docs',
    label: 'Documentation',
    path: '/admin/docs',
    icon: Book,
    section: 'Support',
    description: 'Platform documentation',
    keywords: ['docs', 'documentation', 'guides', 'manual']
  },
  
  // Settings always at the end
  {
    id: 'settings',
    label: 'Settings',
    path: '/admin/settings',
    icon: Settings,
    section: 'System',
    permission: ADMIN_PERMISSIONS.SETTINGS_VIEW,
    description: 'Admin settings and preferences',
    keywords: ['settings', 'preferences', 'options', 'configure']
  }
];
