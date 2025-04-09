
/**
 * Core auth types for the application
 */

// User roles available in the system
export type UserRole = 
  | 'viewer'       // Basic read-only access
  | 'editor'       // Can edit but not publish
  | 'publisher'    // Can edit and publish
  | 'admin'        // Full access to admin features
  | 'super_admin'; // Full access + debug features

// Authentication status
export type AuthStatus = 
  | 'idle'           // Initial state
  | 'loading'        // Authentication in progress
  | 'authenticated'  // User is logged in
  | 'unauthenticated' // User is not logged in
  | 'error';         // Authentication error occurred

// User with basic profile information
export interface User {
  id: string;
  email?: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  roles: UserRole[];
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Authentication session
export interface AuthSession {
  userId: string;
  token: string;
  expires: Date;
  isValid: boolean;
}

// Auth provider types
export type AuthProvider =
  | 'email'
  | 'google'
  | 'github'
  | 'twitter'
  | 'facebook'
  | 'apple';
