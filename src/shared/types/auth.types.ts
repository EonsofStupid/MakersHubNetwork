
/**
 * Auth related types 
 */

import { BaseEntity, UserMetadata } from "./shared.types";

export type UserRole = 'user' | 'admin' | 'super_admin' | 'builder' | 'content_manager';

export type Permission = 
  | 'create:users' 
  | 'read:users' 
  | 'update:users' 
  | 'delete:users'
  | 'manage:content'
  | 'manage:layouts'
  | 'manage:settings'
  | 'view:admin'
  | 'view:analytics'
  | 'manage:builds';

export interface User extends BaseEntity {
  email: string;
  displayName?: string;
  avatarUrl?: string;
  roles?: UserRole[];
  metadata: UserMetadata;
}

export interface UserProfile {
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  preferences?: Record<string, any>;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
