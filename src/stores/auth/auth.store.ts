
// Update imports
import { UserRole, LogCategory } from '@/shared/types/shared.types';

// Define UserProfile interface if missing
interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  user_metadata?: Record<string, unknown>;
}
