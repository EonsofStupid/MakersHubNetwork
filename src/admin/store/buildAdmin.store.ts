
import { create } from 'zustand';
import { 
  BuildAdminStore, 
  BuildFilter, 
  BuildPagination 
} from '../types/build.types';
import { Build, BuildStatus, BuildPart, BuildMod } from '@/shared/types/shared.types';

// Create the build admin store
export const useBuildAdminStore = create<BuildAdminStore>((set, get) => ({
  // State
  builds: [],
  selectedBuild: null,
  selectedBuildId: null,
  isLoading: false,
  error: null,
  
  // Filters and pagination
  filters: {
    status: 'all',
    dateRange: [null, null],
    sortBy: 'newest',
  },
  
  pagination: {
    page: 1,
    perPage: 10,
    total: 0,
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
          status: "pending",
          submittedBy: "maker42",
          userId: "user-1",
          userName: "John Maker",
          complexity_score: 8.5,
          parts_count: 57,
          mods_count: 6,
          display_name: "John Maker",
          avatar_url: null,
          created_at: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "build-2",
          title: "Ender 3 V2 Upgrades",
          description: "Heavily modified Ender 3 with linear rails",
          status: "approved",
          submittedBy: "printmaster",
          userId: "user-2",
          userName: "Print Master",
          complexity_score: 5.2,
          parts_count: 28,
          mods_count: 4,
          display_name: "Print Master",
          avatar_url: null,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
        }
      ] as Build[];
      
      set({ 
        builds: mockBuilds,
        isLoading: false,
        pagination: {
          ...pagination,
          total: mockBuilds.length
        }
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error : new Error(String(error))
      });
    }
  },
  
  // Fetch a single build by ID
  fetchBuild: async (id: string) => {
    return get().fetchBuildById(id);
  },
  
  // Fetch a build by ID
  fetchBuildById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock a single build response
      const mockBuild: Build = {
        id,
        title: "Voron 2.4 Custom Build",
        description: "My custom Voron 2.4 build with modified hot end and linear rails",
        status: "pending",
        submittedBy: "maker42",
        userId: "user-1",
        userName: "John Maker",
        complexity_score: 8.5,
        parts_count: 57,
        mods_count: 6,
        display_name: "John Maker",
        avatar_url: null,
        created_at: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        images: [
          "https://via.placeholder.com/600x400?text=Build+Image+1",
          "https://via.placeholder.com/600x400?text=Build+Image+2"
        ],
        parts: [
          { id: "part-1", name: "Hot End", quantity: 1, type: "component", notes: "Mosquito Hot End" },
          { id: "part-2", name: "Linear Rails", quantity: 4, type: "component", notes: "MGN12H Rails" },
          { id: "part-3", name: "Stepper Motors", quantity: 5, type: "component", notes: "LDO Motors" }
        ],
        mods: [
          { 
            id: "mod-1", 
            name: "Stealthburner", 
            description: "Modified Stealthburner print head", 
            build_id: id,
            complexity: 4,
            created_at: new Date().toISOString()
          },
          { 
            id: "mod-2", 
            name: "Klicky Probe", 
            description: "Added Klicky auto probe", 
            build_id: id,
            complexity: 3,
            created_at: new Date().toISOString()
          }
        ]
      };
      
      set({ 
        selectedBuild: mockBuild,
        isLoading: false
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error : new Error(String(error))
      });
    }
  },
  
  // Select a build
  selectBuild: (id: string) => {
    set({ selectedBuildId: id });
    get().fetchBuildById(id);
  },
  
  // Update filters
  updateFilters: (filters: Partial<BuildFilter>) => {
    set(state => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, page: 1 } // Reset to first page on filter change
    }));
    
    // Refetch with new filters
    get().fetchBuilds();
  },
  
  // Update pagination
  updatePagination: (pagination: Partial<BuildPagination>) => {
    set(state => ({
      pagination: { ...state.pagination, ...pagination }
    }));
    
    // Refetch with new pagination
    get().fetchBuilds();
  },
  
  // Approve a build
  approveBuild: async (id: string, comment: string) => {
    try {
      set({ isLoading: true });
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the build in state
      const currentBuild = get().selectedBuild;
      if (currentBuild && currentBuild.id === id) {
        set({ 
          selectedBuild: { ...currentBuild, status: "approved" as BuildStatus },
        });
      }
      
      // Refetch builds to update the list
      get().fetchBuilds();
      set({ isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error : new Error(String(error))
      });
    }
  },
  
  // Reject a build
  rejectBuild: async (id: string, comment: string) => {
    try {
      set({ isLoading: true });
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the build in state
      const currentBuild = get().selectedBuild;
      if (currentBuild && currentBuild.id === id) {
        set({ 
          selectedBuild: { ...currentBuild, status: "rejected" as BuildStatus },
        });
      }
      
      // Refetch builds to update the list
      get().fetchBuilds();
      set({ isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error : new Error(String(error))
      });
    }
  },
  
  // Request revision for a build
  requestRevision: async (id: string, comment: string) => {
    try {
      set({ isLoading: true });
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the build in state
      const currentBuild = get().selectedBuild;
      if (currentBuild && currentBuild.id === id) {
        set({ 
          selectedBuild: { ...currentBuild, status: "needs_revision" as BuildStatus },
        });
      }
      
      // Refetch builds to update the list
      get().fetchBuilds();
      set({ isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error : new Error(String(error))
      });
    }
  },
  
  // Clear any errors
  clearError: () => set({ error: null })
}));
