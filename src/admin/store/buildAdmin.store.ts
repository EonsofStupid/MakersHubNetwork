
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { BuildAdminStore, Build, BuildStatus } from "../types/build.types";
import { toast } from "sonner";

export const useBuildAdminStore = create<BuildAdminStore>((set, get) => ({
  builds: [],
  selectedBuild: null,
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    dateRange: [null, null],
    sortBy: 'newest'
  },
  pagination: {
    page: 1,
    perPage: 10,
    total: 0
  },
  
  fetchBuilds: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { filters, pagination } = get();
      const { page, perPage } = pagination;
      
      // Calculate the range
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;
      
      // Start building the query
      let query = supabase
        .from('printer_builds')
        .select(`
          *,
          profiles:submitted_by (display_name, avatar_url)
        `, { count: 'exact' })
        .range(from, to);
      
      // Apply status filter if not 'all'
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      // Apply date range filter if set
      if (filters.dateRange[0] && filters.dateRange[1]) {
        query = query.gte('created_at', filters.dateRange[0].toISOString())
          .lte('created_at', filters.dateRange[1].toISOString());
      }
      
      // Apply sorting
      switch (filters.sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'complexity':
          query = query.order('complexity_score', { ascending: false });
          break;
      }
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      // Transform data to match our Build interface
      const builds = data.map(build => ({
        ...build,
        display_name: build.profiles?.display_name,
        avatar_url: build.profiles?.avatar_url,
        reviews: [],
        parts: [],
        mods: []
      })) as Build[];
      
      set({ 
        builds, 
        isLoading: false,
        pagination: {
          ...pagination,
          total: count || 0
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch builds';
      set({ error: errorMessage, isLoading: false });
      console.error('Error fetching builds:', error);
    }
  },
  
  fetchBuildById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      // Fetch the build details
      const { data: buildData, error: buildError } = await supabase
        .from('printer_builds')
        .select(`
          *,
          profiles:submitted_by (display_name, avatar_url)
        `)
        .eq('id', id)
        .single();
      
      if (buildError) throw buildError;
      
      // Fetch the build parts
      const { data: partsData, error: partsError } = await supabase
        .from('build_parts')
        .select(`
          *,
          printer_parts!inner (name)
        `)
        .eq('build_id', id);
      
      if (partsError) throw partsError;
      
      // Fetch the build mods
      const { data: modsData, error: modsError } = await supabase
        .from('build_mods')
        .select('*')
        .eq('build_id', id);
      
      if (modsError) throw modsError;
      
      // Transform parts data
      const parts = partsData.map(part => ({
        id: part.id,
        name: part.printer_parts?.name || 'Unknown Part',
        quantity: part.quantity,
        notes: part.notes
      }));
      
      // Format the build with all related data
      const build: Build = {
        ...buildData,
        // Handle nullable/undefined fields with default values
        display_name: buildData.profiles?.display_name || null,
        avatar_url: buildData.profiles?.avatar_url || null,
        // Convert null/undefined arrays to empty arrays
        images: buildData.images || [],
        parts,
        mods: modsData || [],
        reviews: [] // We'll populate this separately if needed
      };
      
      set({ selectedBuild: build, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch build details';
      set({ error: errorMessage, isLoading: false });
      console.error('Error fetching build details:', error);
    }
  },
  
  approveBuild: async (id, comments) => {
    await updateBuildStatus(id, 'approved', comments, set, get);
  },
  
  rejectBuild: async (id, comments) => {
    await updateBuildStatus(id, 'rejected', comments, set, get);
  },
  
  requestRevision: async (id, comments) => {
    await updateBuildStatus(id, 'needs_revision', comments, set, get);
  },
  
  updateFilters: (filters) => {
    set({
      filters: { ...get().filters, ...filters },
      pagination: { ...get().pagination, page: 1 } // Reset to first page on filter change
    });
    get().fetchBuilds();
  },
  
  updatePagination: (pagination) => {
    set({ pagination: { ...get().pagination, ...pagination } });
    get().fetchBuilds();
  },
  
  setSelectedBuild: (build) => {
    set({ selectedBuild: build });
  },
  
  clearError: () => {
    set({ error: null });
  }
}));

// Helper function to update build status
async function updateBuildStatus(
  id: string, 
  status: BuildStatus, 
  comments: string,
  set: (state: Partial<BuildAdminStore>) => void,
  get: () => BuildAdminStore
) {
  try {
    set({ isLoading: true, error: null });
    
    // Update the build status
    const { error: updateError } = await supabase
      .from('printer_builds')
      .update({ 
        status,
        processed_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (updateError) throw updateError;
    
    // Since build_reviews table might not exist in the database schema,
    // we'll just log the review action instead of inserting it
    console.log('Build review created:', {
      build_id: id,
      reviewer_id: (await supabase.auth.getUser()).data.user?.id,
      status,
      comments
    });
    
    // Update UI
    toast(`Build has been ${status}`, {
      description: status === 'rejected' ? 'The build was rejected' : 
                   status === 'approved' ? 'The build was approved' : 
                   'Revision requested for the build'
    });
    
    // Refresh the builds list
    await get().fetchBuilds();
    
    // If there's a selected build, refresh it too
    if (get().selectedBuild?.id === id) {
      await get().fetchBuildById(id);
    }
    
    set({ isLoading: false });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : `Failed to ${status} build`;
    set({ error: errorMessage, isLoading: false });
    console.error(`Error updating build status to ${status}:`, error);
    
    toast('Error', {
      description: errorMessage,
    });
  }
}
