import { create } from 'zustand';
import { 
  BuildAdminStore, 
  BuildFilters, 
  BuildPagination,
  Build,
  BuildStatus,
  BuildPart,
  BuildMod 
} from '@/shared/types/build.types';

// Create the build admin store
export const useBuildAdminStore = create<BuildAdminStore>((set, get) => ({
  // State
  builds: [],
  selectedBuild: null,
  isLoading: false,
  error: null,
  
  // Filters and pagination
  filters: {
    status: null,
    dateRange: {
      from: undefined,
      to: undefined
    },
    sortBy: 'newest',
  },
  
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1
  },
  
  // Update pagination
  updatePagination: (paginationUpdate) => {
    set(state => ({
      pagination: { ...state.pagination, ...paginationUpdate }
    }));
    
    // Refetch with new pagination
    get().fetchBuilds();
  },
  
  // Fetch builds with filters and pagination
  fetchBuilds: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // In a real app, this would be an API call with filters and pagination
      const { filters, pagination } = get();
      
      // Mock API response
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockBuilds: Build[] = [
        {
          id: "build-1",
          title: "Voron 2.4 Custom Build",
          description: "My custom Voron 2.4 build with modified hot end",
          status: BuildStatus.PENDING,
          creator_id: "user-1",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          complexity: 8.5,
          user: {
            displayName: "John Maker",
            avatarUrl: null
          }
        },
        {
          id: "build-2",
          title: "Ender 3 V2 Upgrades",
          description: "Heavily modified Ender 3 with linear rails",
          status: BuildStatus.APPROVED,
          creator_id: "user-2",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          complexity: 5.2,
          user: {
            displayName: "Print Master",
            avatarUrl: null
          }
        }
      ];
      
      set({ 
        builds: mockBuilds,
        isLoading: false,
        pagination: {
          ...pagination,
          total: mockBuilds.length
        }
      });
    } catch (err) {
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : String(err)
      });
    }
  },
  
  // Fetch a single build by ID
  fetchBuild: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock a single build response
      const mockBuild: Build = {
        id,
        title: "Voron 2.4 Custom Build",
        description: "My custom Voron 2.4 build with modified hot end and linear rails",
        status: BuildStatus.PENDING,
        creator_id: "user-1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        complexity: 8.5,
        user: {
          displayName: "John Maker",
          avatarUrl: null
        },
        image_urls: [
          "https://via.placeholder.com/600x400?text=Build+Image+1",
          "https://via.placeholder.com/600x400?text=Build+Image+2"
        ],
        parts: [
          { id: "part-1", name: "Hot End", quantity: 1, notes: "Mosquito Hot End", build_id: id, created_at: new Date().toISOString() },
          { id: "part-2", name: "Linear Rails", quantity: 4, notes: "MGN12H Rails", build_id: id, created_at: new Date().toISOString() },
          { id: "part-3", name: "Stepper Motors", quantity: 5, notes: "LDO Motors", build_id: id, created_at: new Date().toISOString() }
        ],
        mods: [
          { 
            id: "mod-1", 
            name: "Stealthburner", 
            description: "Modified Stealthburner print head",
            build_id: id,
            status: BuildStatus.APPROVED,
            created_at: new Date().toISOString(),
            complexity: 4
          },
          { 
            id: "mod-2", 
            name: "Klicky Probe", 
            description: "Added Klicky auto probe", 
            build_id: id,
            status: BuildStatus.APPROVED,
            created_at: new Date().toISOString(),
            complexity: 3
          }
        ]
      };
      
      set({ 
        selectedBuild: mockBuild,
        isLoading: false
      });
      
      return mockBuild;
    } catch (err) {
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : String(err)
      });
      return null;
    }
  },
  
  // Update filters
  updateFilters: (filtersUpdate) => {
    set(state => ({
      filters: { ...state.filters, ...filtersUpdate },
      pagination: { ...state.pagination, page: 1 } // Reset to first page on filter change
    }));
    
    // Refetch with new filters
    get().fetchBuilds();
  },
  
  // Change page
  changePage: (page: number) => {
    set(state => ({
      pagination: { ...state.pagination, page }
    }));
    
    // Refetch with new pagination
    get().fetchBuilds();
  },
  
  // Change page size
  changePageSize: (size: number) => {
    set(state => ({
      pagination: { ...state.pagination, pageSize: size, page: 1 }
    }));
    
    // Refetch with new pagination
    get().fetchBuilds();
  },
  
  // Approve a build
  approveBuild: async (id: string, comment?: string) => {
    try {
      set({ isLoading: true });
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the build in state
      const currentBuild = get().selectedBuild;
      if (currentBuild && currentBuild.id === id) {
        set({ 
          selectedBuild: { ...currentBuild, status: BuildStatus.APPROVED },
        });
      }
      
      // Refetch builds to update the list
      get().fetchBuilds();
      set({ isLoading: false });
    } catch (err) {
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : String(err)
      });
    }
  },
  
  // Reject a build
  rejectBuild: async (id: string, reason: string) => {
    try {
      set({ isLoading: true });
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the build in state
      const currentBuild = get().selectedBuild;
      if (currentBuild && currentBuild.id === id) {
        set({ 
          selectedBuild: { ...currentBuild, status: BuildStatus.REJECTED },
        });
      }
      
      // Refetch builds to update the list
      get().fetchBuilds();
      set({ isLoading: false });
    } catch (err) {
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : String(err)
      });
    }
  },
  
  // Request revision for a build
  requestRevision: async (id: string, feedback: string) => {
    try {
      set({ isLoading: true });
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the build in state
      const currentBuild = get().selectedBuild;
      if (currentBuild && currentBuild.id === id) {
        set({ 
          selectedBuild: { ...currentBuild, status: BuildStatus.NEEDS_REVISION },
        });
      }
      
      // Refetch builds to update the list
      get().fetchBuilds();
      set({ isLoading: false });
    } catch (err) {
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : String(err)
      });
    }
  },
  
  // Clear any errors
  clearError: () => set({ error: null })
}));
