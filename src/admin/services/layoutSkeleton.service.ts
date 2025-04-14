import { supabase } from '@/lib/supabase';
import { Layout, LayoutSkeleton } from '@/shared/types';

// Type for consistent error handling
type ServiceResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// Define a minimal Supabase error type
interface SupabaseError {
  message?: string;
  code?: string;
}

// Type assertion helper
function assertSupabaseQuery(obj: any): any {
  return obj as any;
}

/**
 * Service for managing layout skeletons in the database
 */
export const layoutSkeletonService = {
  /**
   * Get all layout skeletons
   */
  async getAll(): Promise<ServiceResponse<any[]>> {
    try {
      const result = await supabase
        .from('layout_skeletons')
        .select('*')
        .order('created_at', { ascending: false });
      
      const data = result?.data as any[] || [];
      const error = result?.error as SupabaseError | null;

      if (error) return { success: false, error: String(error.message || 'Failed to fetch layout skeletons') };
      return { success: true, data };
    } catch (err) {
      return { success: false, error: 'Failed to fetch layout skeletons' };
    }
  },

  /**
   * Create a new layout skeleton
   */
  async create(layout: Partial<LayoutSkeleton>): Promise<ServiceResponse<any>> {
    try {
      // Ensure required fields are present
      const newLayout = {
        name: layout.name || 'New Layout',
        description: layout.description || '',
        type: layout.type || 'page',
        scope: layout.scope || 'site',
        layout_json: layout.layout_json || {},
        is_active: layout.is_active !== undefined ? layout.is_active : true,
        is_locked: layout.is_locked !== undefined ? layout.is_locked : false,
        version: layout.version || 1
      };

      const result = await supabase
        .from('layout_skeletons')
        .insert(newLayout)
        .select('*');
      
      const data = (result as any)?.data?.[0] || null;
      const error = (result as any)?.error as SupabaseError | null;

      if (error) return { success: false, error: String(error.message || 'Failed to create layout skeleton') };
      return { success: true, data };
    } catch (err) {
      return { success: false, error: 'Failed to create layout skeleton' };
    }
  },

  /**
   * Get a layout skeleton by ID
   */
  async getById(id: string): Promise<ServiceResponse<any>> {
    try {
      const query = assertSupabaseQuery(
        supabase
          .from('layout_skeletons')
          .select('*')
      );
      
      const result = await query.eq('id', id).single();
      
      const data = (result as any)?.data || null;
      const error = (result as any)?.error as SupabaseError | null;

      if (error) return { success: false, error: String(error.message || 'Failed to fetch layout skeleton') };
      return { success: true, data };
    } catch (err) {
      return { success: false, error: 'Failed to fetch layout skeleton' };
    }
  },

  /**
   * Get a layout skeleton by type and scope
   */
  async getByTypeAndScope(type: string, scope: string): Promise<ServiceResponse<any>> {
    try {
      const query = assertSupabaseQuery(
        supabase
          .from('layout_skeletons')
          .select('*')
      );
      
      const result = await query
        .eq('type', type)
        .eq('scope', scope)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      const data = (result as any)?.data || null;
      const error = (result as any)?.error as SupabaseError | null;

      if (error && error.code !== 'PGRST116') {
        return { success: false, error: String(error.message || 'Failed to fetch layout skeleton') };
      } else if (error && error.code === 'PGRST116') {
        return { success: false, error: 'No active layout found' };
      }

      return { success: true, data };
    } catch (err) {
      return { success: false, error: 'Failed to fetch layout skeleton' };
    }
  },

  /**
   * Update a layout skeleton
   */
  async update(id: string, updates: Partial<LayoutSkeleton>): Promise<ServiceResponse<any>> {
    try {
      const updateData: Record<string, any> = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.layout_json !== undefined) updateData.layout_json = updates.layout_json;
      if (updates.is_active !== undefined) updateData.is_active = updates.is_active;
      if (updates.is_locked !== undefined) updateData.is_locked = updates.is_locked;
      if (updates.version !== undefined) updateData.version = updates.version;

      const query = assertSupabaseQuery(
        supabase
          .from('layout_skeletons')
          .update(updateData)
      );

      const result = await query
        .eq('id', id)
        .select('*');
      
      const data = (result as any)?.data?.[0] || null;
      const error = (result as any)?.error as SupabaseError | null;

      if (error) return { success: false, error: String(error.message || 'Failed to update layout skeleton') };
      return { success: true, data };
    } catch (err) {
      return { success: false, error: 'Failed to update layout skeleton' };
    }
  },

  /**
   * Delete a layout skeleton
   */
  async delete(id: string): Promise<ServiceResponse<null>> {
    try {
      const query = assertSupabaseQuery(
        supabase
          .from('layout_skeletons')
          .delete()
      );
      
      const result = await query.eq('id', id);
      
      const error = (result as any)?.error as SupabaseError | null;

      if (error) return { success: false, error: String(error.message || 'Failed to delete layout skeleton') };
      return { success: true, data: null };
    } catch (err) {
      return { success: false, error: 'Failed to delete layout skeleton' };
    }
  },

  /**
   * Set a layout as active
   */
  async setActive(id: string): Promise<ServiceResponse<null>> {
    try {
      // First get the layout to get its type and scope
      const getQuery = assertSupabaseQuery(
        supabase
          .from('layout_skeletons')
          .select('type, scope')
      );
      
      const getResult = await getQuery.eq('id', id).single();
      
      const layout = (getResult as any)?.data as { type: string; scope: string };
      const getError = (getResult as any)?.error as SupabaseError | null;

      if (getError) return { success: false, error: String(getError.message || 'Failed to fetch layout') };

      // Reset all layouts of the same type and scope
      const resetQuery = assertSupabaseQuery(
        supabase
          .from('layout_skeletons')
          .update({ is_active: false })
      );
      
      await resetQuery
        .eq('type', layout.type)
        .eq('scope', layout.scope);

      // Set the selected layout as active
      const activateQuery = assertSupabaseQuery(
        supabase
          .from('layout_skeletons')
          .update({ is_active: true })
      );
      
      const activateResult = await activateQuery.eq('id', id);
      
      const error = (activateResult as any)?.error as SupabaseError | null;

      if (error) return { success: false, error: String(error.message || 'Failed to set layout as active') };
      return { success: true, data: null };
    } catch (err) {
      return { success: false, error: 'Failed to set layout as active' };
    }
  }
};
