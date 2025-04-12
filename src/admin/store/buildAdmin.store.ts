import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { Build, BuildStatus } from '@/shared/types/shared.types';
import { DateRange } from '@/shared/types/shared.types';

export interface BuildFilters {
  status?: BuildStatus | 'all';
  dateRange?: DateRange;
  sortBy?: string;
  search?: string;
  category?: string;
  complexity?: number;
  userId?: string;
}

export interface BuildPagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface BuildAdminStore {
  builds: Build[];
  selectedBuild: Build | null;
  filters: BuildFilters;
  pagination: BuildPagination;
  loading: boolean;
  error: string | null;
  
  fetchBuilds: () => Promise<void>;
  fetchBuild: (id: string) => Promise<void>;
  approveBuild: (id: string, comment?: string) => Promise<void>;
  rejectBuild: (id: string, reason: string) => Promise<void>;
  requestRevision: (id: string, comment: string) => Promise<void>;
  deleteBuild: (id: string) => Promise<void>;
  updateFilters: (filters: Partial<BuildFilters>) => void;
  updatePagination: (pagination: Partial<BuildPagination>) => void;
  clearError: () => void;
}

const initialState = {
  builds: [],
  selectedBuild: null,
  filters: {
    status: 'all',
    sortBy: 'created_at',
  },
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
  loading: false,
  error: null,
};

const buildAdminStore = createStore<BuildAdminStore>()((set, get) => ({
  ...initialState,
  
  fetchBuilds: async () => {
    try {
      set({ loading: true, error: null });
      // Implement actual fetch logic here
      // const builds = await fetchBuildsFromApi(get().filters, get().pagination);
      // set({ builds, pagination: { ...get().pagination, total: builds.length } });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch builds' });
    } finally {
      set({ loading: false });
    }
  },
  
  fetchBuild: async (id: string) => {
    try {
      set({ loading: true, error: null });
      // Implement actual fetch logic here
      // const build = await fetchBuildById(id);
      // set({ selectedBuild: build });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch build' });
    } finally {
      set({ loading: false });
    }
  },
  
  approveBuild: async (id: string, comment?: string) => {
    try {
      set({ loading: true, error: null });
      // Implement actual approval logic here
      // await approveBuildApi(id, comment);
      // Update the local state
      // set(state => ({
      //   builds: state.builds.map(build => 
      //     build.id === id ? { ...build, status: 'APPROVED' } : build
      //   ),
      //   selectedBuild: state.selectedBuild?.id === id 
      //     ? { ...state.selectedBuild, status: 'APPROVED' } 
      //     : state.selectedBuild
      // }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to approve build' });
    } finally {
      set({ loading: false });
    }
  },
  
  rejectBuild: async (id: string, reason: string) => {
    try {
      set({ loading: true, error: null });
      // Implement actual rejection logic here
      // await rejectBuildApi(id, reason);
      // Update the local state
      // set(state => ({
      //   builds: state.builds.map(build => 
      //     build.id === id ? { ...build, status: 'REJECTED' } : build
      //   ),
      //   selectedBuild: state.selectedBuild?.id === id 
      //     ? { ...state.selectedBuild, status: 'REJECTED' } 
      //     : state.selectedBuild
      // }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to reject build' });
    } finally {
      set({ loading: false });
    }
  },
  
  requestRevision: async (id: string, comment: string) => {
    try {
      set({ loading: true, error: null });
      // Implement actual revision logic here
      // await requestBuildRevision(id, comment);
      // Update the local state
      // set(state => ({
      //   builds: state.builds.map(build => 
      //     build.id === id ? { ...build, status: 'NEEDS_REVISION' } : build
      //   ),
      //   selectedBuild: state.selectedBuild?.id === id 
      //     ? { ...state.selectedBuild, status: 'NEEDS_REVISION' } 
      //     : state.selectedBuild
      // }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to request revision' });
    } finally {
      set({ loading: false });
    }
  },
  
  deleteBuild: async (id: string) => {
    try {
      set({ loading: true, error: null });
      // Implement actual delete logic here
      // await deleteBuildApi(id);
      // Update the local state
      // set(state => ({
      //   builds: state.builds.filter(build => build.id !== id),
      //   selectedBuild: state.selectedBuild?.id === id ? null : state.selectedBuild
      // }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete build' });
    } finally {
      set({ loading: false });
    }
  },
  
  updateFilters: (filters: Partial<BuildFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 }, // Reset to first page when filters change
    }));
  },
  
  updatePagination: (pagination: Partial<BuildPagination>) => {
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    }));
  },
  
  clearError: () => {
    set({ error: null });
  }
}));

export const useBuildAdminStore = () => useStore(buildAdminStore);

export default buildAdminStore;
