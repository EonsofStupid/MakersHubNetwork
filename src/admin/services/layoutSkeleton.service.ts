
import { supabase } from '@/lib/supabase';
import { Layout, LayoutSkeleton } from '@/shared/types';

/**
 * Service for managing layout skeletons in the database
 */
export const layoutSkeletonService = {
  /**
   * Get all layout skeletons
   */
  async getAll() {
    const { data, error } = await supabase
      .from('layout_skeletons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  },

  /**
   * Create a new layout skeleton
   */
  async create(layout: Partial<LayoutSkeleton>) {
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

    const { data, error } = await supabase
      .from('layout_skeletons')
      .insert(newLayout)
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  },

  /**
   * Get a layout skeleton by ID
   */
  async getById(id: string) {
    const { data, error } = await supabase
      .from('layout_skeletons')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  },

  /**
   * Get a layout skeleton by type and scope
   */
  async getByTypeAndScope(type: string, scope: string) {
    const { data, error } = await supabase
      .from('layout_skeletons')
      .select('*')
      .eq('type', type)
      .eq('scope', scope)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      return { success: false, error: error.message };
    } else if (error && error.code === 'PGRST116') {
      return { success: false, error: 'No active layout found' };
    }

    return { success: true, data };
  },

  /**
   * Update a layout skeleton
   */
  async update(id: string, updates: Partial<LayoutSkeleton>) {
    const { data, error } = await supabase
      .from('layout_skeletons')
      .update({
        name: updates.name,
        description: updates.description,
        layout_json: updates.layout_json,
        is_active: updates.is_active,
        is_locked: updates.is_locked,
        version: updates.version
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  },

  /**
   * Delete a layout skeleton
   */
  async delete(id: string) {
    const { error } = await supabase
      .from('layout_skeletons')
      .delete()
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  },

  /**
   * Set a layout as active
   */
  async setActive(id: string) {
    const { data: layout, error: getError } = await supabase
      .from('layout_skeletons')
      .select('type, scope')
      .eq('id', id)
      .single();

    if (getError) return { success: false, error: getError.message };

    // Reset all layouts of the same type and scope
    await supabase
      .from('layout_skeletons')
      .update({ is_active: false })
      .eq('type', layout.type)
      .eq('scope', layout.scope);

    // Set the selected layout as active
    const { error } = await supabase
      .from('layout_skeletons')
      .update({ is_active: true })
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  }
};
