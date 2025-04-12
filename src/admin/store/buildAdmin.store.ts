
import { create } from 'zustand';
import { Build, BuildStatus } from '@/shared/types/shared.types';

// Pagination interface
interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

// Filter interface
interface FilterState {
  status: BuildStatus | null;
  dateRange: {
    from?: Date;
    to?: Date;
  };
  sortBy: 'newest' | 'oldest' | 'complexity';
}

export interface BuildAdminStore {
  builds: Build[];
  selectedBuild: Build | null;
  pagination: PaginationState;
  filters: FilterState;
  isLoading: boolean;
  error: string | null;

  fetchBuilds: () => Promise<void>;
  fetchBuild: (id: string) => Promise<void>;
  approveBuild: (id: string, comment?: string) => Promise<void>;
  rejectBuild: (id: string, reason: string) => Promise<void>;
  requestRevision: (id: string, feedback: string) => Promise<void>;
  clearError: () => void;
  updatePagination: (update: Partial<PaginationState>) => void;
  updateFilters: (update: Partial<FilterState>) => void;
}

// Create the store
export const useBuildAdminStore = create<BuildAdminStore>((set, get) => ({
  builds: [],
  selectedBuild: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0
  },
  filters: {
    status: null,
    dateRange: {},
    sortBy: 'newest'
  },
  isLoading: false,
  error: null,

  fetchBuilds: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Mock data for now - replace with API call
      setTimeout(() => {
        const mockBuilds: Build[] = Array.from({ length: 10 }).map((_, index) => ({
          id: `build-${index}`,
          title: `Test Build ${index}`,
          description: `This is a test build ${index}`,
          status: index % 3 === 0 ? BuildStatus.PENDING : 
                  index % 3 === 1 ? BuildStatus.APPROVED : BuildStatus.REJECTED,
          submitted_by: `user-${index}`,
          complexity_score: Math.floor(Math.random() * 10),
          complexity: Math.floor(Math.random() * 10),
          parts_count: Math.floor(Math.random() * 20),
          mods_count: Math.floor(Math.random() * 5),
          parts: Array.from({ length: Math.floor(Math.random() * 20) }).map((_, i) => ({
            id: `part-${i}`,
            name: `Part ${i}`
          })),
          mods: Array.from({ length: Math.floor(Math.random() * 5) }).map((_, i) => ({
            id: `mod-${i}`,
            name: `Mod ${i}`
          })),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            id: `user-${index}`,
            displayName: `User ${index}`,
            avatarUrl: `https://i.pravatar.cc/150?u=user-${index}`
          }
        }));

        set({ 
          builds: mockBuilds, 
          isLoading: false,
          pagination: {
            ...get().pagination,
            total: 50 // Mock total
          }
        });
      }, 500);
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch builds' });
    }
  },

  fetchBuild: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Mock data - replace with API call
      setTimeout(() => {
        const mockBuild: Build = {
          id,
          title: `Build ${id}`,
          description: 'This is a test build with a longer description to show details.',
          status: BuildStatus.PENDING,
          submitted_by: 'user-1',
          complexity_score: 7,
          complexity: 7,
          parts_count: 15,
          mods_count: 3,
          parts: Array.from({ length: 15 }).map((_, i) => ({
            id: `part-${i}`,
            name: `Part ${i}`,
            quantity: Math.floor(Math.random() * 5) + 1
          })),
          mods: Array.from({ length: 3 }).map((_, i) => ({
            id: `mod-${i}`,
            name: `Mod ${i}`,
            description: `This is a modification that enhances the build.`
          })),
          image_urls: [
            'https://via.placeholder.com/400x300?text=Build+Image+1',
            'https://via.placeholder.com/400x300?text=Build+Image+2'
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            id: 'user-1',
            displayName: 'John Doe',
            avatarUrl: 'https://i.pravatar.cc/150?u=john'
          }
        };

        set({ selectedBuild: mockBuild, isLoading: false });
      }, 500);
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch build details' });
    }
  },

  approveBuild: async (id: string, comment?: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Mock approval - replace with API call
      setTimeout(() => {
        set(state => ({
          selectedBuild: state.selectedBuild ? {
            ...state.selectedBuild,
            status: BuildStatus.APPROVED
          } : null,
          isLoading: false
        }));
      }, 500);
    } catch (error) {
      set({ isLoading: false, error: 'Failed to approve build' });
    }
  },

  rejectBuild: async (id: string, reason: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Mock rejection - replace with API call
      setTimeout(() => {
        set(state => ({
          selectedBuild: state.selectedBuild ? {
            ...state.selectedBuild,
            status: BuildStatus.REJECTED
          } : null,
          isLoading: false
        }));
      }, 500);
    } catch (error) {
      set({ isLoading: false, error: 'Failed to reject build' });
    }
  },
  
  requestRevision: async (id: string, feedback: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Mock request for revision - replace with API call
      setTimeout(() => {
        set(state => ({
          selectedBuild: state.selectedBuild ? {
            ...state.selectedBuild,
            status: BuildStatus.NEEDS_REVISION
          } : null,
          isLoading: false
        }));
      }, 500);
    } catch (error) {
      set({ isLoading: false, error: 'Failed to request revision' });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  updatePagination: (update) => {
    set(state => ({
      pagination: {
        ...state.pagination,
        ...update
      }
    }));
    
    // Refetch with new pagination
    get().fetchBuilds();
  },

  updateFilters: (update) => {
    set(state => ({
      filters: {
        ...state.filters,
        ...update
      },
      pagination: {
        ...state.pagination,
        page: 1 // Reset to first page when filters change
      }
    }));
    
    // Refetch with new filters
    get().fetchBuilds();
  }
}));
