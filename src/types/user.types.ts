
export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  role?: string;
  bio?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}
