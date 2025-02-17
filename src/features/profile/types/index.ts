import { UserRole } from "@/features/auth/types"

export interface ProfileMetadata {
  display_name: string;
  bio: string;
  avatar_url?: string;
  theme_preference: string;
  motion_enabled: boolean;
  social_links?: {
    github?: string;
    twitter?: string;
  };
}

export interface ProfileState {
  isLoading: boolean;
  error: string | null;
  metadata: ProfileMetadata | null;
}

export interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

export interface ProfileEditorProps {
  onClose: () => void;
}

export interface UserActivityProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  is_active: boolean;
  admin_override_active: boolean;
  profile_completed: boolean;
  last_login: string | null;
  last_forum_activity: string | null;
  user_roles: Array<{
    role: UserRole;
  }>;
}

export interface UserActivityStats {
  totalUsers: number;
  activeUsers: number;
  completedProfiles: number;
  adminOverrides: number;
} 