
// Main shared types file for the application

// User Role enumeration
export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
  BUILDER = 'builder'  // Used in admin hooks
}

// Content Status enumeration
export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  SCHEDULED = 'scheduled'  // Adding missing scheduled status
}

// Log Category enumeration
export enum LogCategory {
  SYSTEM = 'system',
  AUTH = 'auth',
  ADMIN = 'admin',
  USER = 'user',
  UI = 'ui',           // Adding missing UI category
  NETWORK = 'network', // Adding missing NETWORK category
  STORE = 'store',     // Adding missing STORE category
  DEFAULT = 'default', // Adding missing DEFAULT category
  CHAT = 'chat'        // Adding missing CHAT category
}

// Review Status enumeration
export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

// Review Stats interface
export interface ReviewStats {
  totalReviews: number;
  avgRating: number;
  ratingCounts: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
