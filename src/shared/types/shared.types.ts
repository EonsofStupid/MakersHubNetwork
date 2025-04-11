
// Basic shared types used across the application

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export type UserRole = 'user' | 'admin' | 'superadmin' | 'moderator' | 'builder';

export type Permission = string;
