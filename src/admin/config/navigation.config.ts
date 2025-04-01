
import {
  BarChart3,
  Users,
  FileText,
  Package,
  Star,
  Settings,
  Palette,
  Database,
  Code,
  Shield,
  Layout,
  MessagesSquare,
  ClipboardList,
  FileCode,
  KeySquare,
  ServerCog
} from "lucide-react";
import { ADMIN_PERMISSIONS } from "../constants/permissions";

export const adminNavigationItems = [
  {
    id: "overview",
    label: "Overview",
    path: "/admin/overview",
    icon: BarChart3,
    permission: ADMIN_PERMISSIONS.ADMIN_VIEW
  },
  {
    id: "users",
    label: "Users",
    path: "/admin/users",
    icon: Users,
    permission: ADMIN_PERMISSIONS.USERS_VIEW
  },
  {
    id: "builds",
    label: "Builds",
    path: "/admin/builds",
    icon: Package,
    permission: ADMIN_PERMISSIONS.BUILDS_VIEW
  },
  {
    id: "reviews",
    label: "Reviews",
    path: "/admin/reviews",
    icon: Star,
    permission: ADMIN_PERMISSIONS.REVIEWS_VIEW
  },
  {
    id: "content",
    label: "Content",
    path: "/admin/content",
    icon: FileText,
    permission: ADMIN_PERMISSIONS.CONTENT_VIEW
  },
  {
    id: "permissions",
    label: "Permissions",
    path: "/admin/permissions",
    icon: Shield,
    permission: ADMIN_PERMISSIONS.ADMIN_VIEW
  },
  {
    id: "themes",
    label: "Themes",
    path: "/admin/themes",
    icon: Palette,
    permission: ADMIN_PERMISSIONS.THEMES_VIEW
  },
  {
    id: "layouts",
    label: "Layouts",
    path: "/admin/layouts",
    icon: Layout,
    permission: ADMIN_PERMISSIONS.ADMIN_EDIT
  },
  {
    id: "data-maestro",
    label: "Data Maestro",
    path: "/admin/data",
    icon: Database,
    permission: ADMIN_PERMISSIONS.DATA_VIEW
  },
  {
    id: "code-studio",
    label: "Code Studio",
    path: "/admin/code",
    icon: Code,
    permission: ADMIN_PERMISSIONS.DATA_VIEW
  },
  {
    id: "settings",
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
    permission: ADMIN_PERMISSIONS.SYSTEM_SETTINGS
  }
];

// Admin top navigation shortcuts
export const adminTopNavShortcuts = [
  {
    id: "chat",
    label: "Chat",
    icon: MessagesSquare,
    action: "toggleChat"
  },
  {
    id: "snippets",
    label: "Snippets",
    icon: ClipboardList,
    action: "toggleSnippets"
  },
  {
    id: "editor",
    label: "Editor",
    icon: FileCode,
    action: "toggleEditor"
  },
  {
    id: "api-keys",
    label: "API Keys",
    icon: KeySquare,
    action: "toggleApiKeys"
  },
  {
    id: "system",
    label: "System",
    icon: ServerCog,
    action: "toggleSystem"
  }
];
