
import { create } from 'zustand';
import { UserRole } from '@/auth/types/roles';
import { PermissionValue } from '@/auth/permissions';

interface AdminStoreState {
  permissions: PermissionValue[];
  isLoading: boolean;
  error: Error | null;
}

export const useAdminStore = create<AdminStoreState>((set) => ({
  permissions: [],
  isLoading: false,
  error: null
}));
