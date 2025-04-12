
import { create } from 'zustand';
import { Build, BuildStatus, DateRange } from '@/shared/types/shared.types';

export interface BuildFilters {
  status?: BuildStatus | 'all';
  dateRange?: DateRange;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface BuildAdminState {
  builds: Build[];
  selectedBuild: Build | null;
  isLoading: boolean;
  error: string | null;
  filters: BuildFilters;
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface BuildAdminStore extends BuildAdminState {
  fetchBuilds: () => Promise<void>;
  fetchBuild: (id: string) => Promise<void>;
  approveBuild: (id: string, comment?: string) => Promise<void>;
  rejectBuild: (id: string, reason: string) => Promise<void>;
  deleteBuild: (id: string) => Promise<void>;
  setFilters: (filters: Partial<BuildFilters>) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  reset: () => void;
}

const initialState: BuildAdminState = {
  builds: [],
  selectedBuild: null,
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    search: '',
    sortBy: 'created_at',
    sortDirection: 'desc',
  },
  totalCount: 0,
  page: 1,
  pageSize: 10,
};

export const useBuildAdminStore = create<BuildAdminStore>((set, get) => ({
  ...initialState,

  fetchBuilds: async () => {
    set({ isLoading: true });
    try {
      // Mock API call for now
      const mockData: Build[] = [
        // Mock builds would go here
      ];
      set({
        builds: mockData,
        isLoading: false,
        totalCount: mockData.length,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch builds',
        isLoading: false,
      });
    }
  },

  fetchBuild: async (id: string) => {
    set({ isLoading: true });
    try {
      // Mock API call for now
      const mockBuild: Build = {
        id,
        title: 'Sample Build',
        description: 'A sample build for testing',
        status: 'PENDING',
        submitted_by: 'user123',
        complexity_score: 3.5,
        parts_count: 12,
        mods_count: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      set({ selectedBuild: mockBuild, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch build',
        isLoading: false,
      });
    }
  },

  approveBuild: async (id: string, comment?: string) => {
    set({ isLoading: true });
    try {
      // Mock API call for now
      set({ isLoading: false });
      await get().fetchBuilds();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to approve build',
        isLoading: false,
      });
    }
  },

  rejectBuild: async (id: string, reason: string) => {
    set({ isLoading: true });
    try {
      // Mock API call for now
      set({ isLoading: false });
      await get().fetchBuilds();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to reject build',
        isLoading: false,
      });
    }
  },

  deleteBuild: async (id: string) => {
    set({ isLoading: true });
    try {
      // Mock API call for now
      set({ isLoading: false });
      await get().fetchBuilds();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete build',
        isLoading: false,
      });
    }
  },

  setFilters: (filters: Partial<BuildFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
      page: 1, // Reset to first page on filter change
    }));
  },

  setPage: (page: number) => {
    set({ page });
  },

  setPageSize: (pageSize: number) => {
    set({ pageSize, page: 1 });
  },

  reset: () => {
    set(initialState);
  },
}));
