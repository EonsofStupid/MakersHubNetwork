
import { supabase } from '@/integrations/supabase/client';
import { LayoutSkeleton, LayoutSchema, Layout } from '@/admin/types/layout.types';
import { toast } from 'sonner';

/**
 * Service for interacting with layout_skeletons table
 */
export const LayoutSkeletonService = {
  /**
   * Fetch all layout skeletons
   */
  async getAllLayouts(): Promise<LayoutSkeleton[]> {
    try {
      const { data, error } = await supabase
        .from('layout_skeletons')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching all layouts:', error);
        return [];
      }

      return data as LayoutSkeleton[];
    } catch (error) {
      console.error('Error in getAllLayouts:', error);
      return [];
    }
  },

  /**
   * Fetch layouts by type
   */
  async getLayoutsByType(type: string): Promise<LayoutSkeleton[]> {
    try {
      const { data, error } = await supabase
        .from('layout_skeletons')
        .select('*')
        .eq('type', type)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching layouts by type:', error);
        return [];
      }

      return data as LayoutSkeleton[];
    } catch (error) {
      console.error('Error in getLayoutsByType:', error);
      return [];
    }
  },

  /**
   * Fetch a layout skeleton by id
   */
  async getById(id: string): Promise<LayoutSkeleton | null> {
    try {
      const { data, error } = await supabase
        .from('layout_skeletons')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching layout skeleton:', error);
        return null;
      }

      return data as LayoutSkeleton;
    } catch (error) {
      console.error('Error in getById:', error);
      return null;
    }
  },

  /**
   * Fetch active layout by type and scope
   */
  async getActiveLayout(type: string, scope: string): Promise<LayoutSkeleton | null> {
    try {
      const { data, error } = await supabase
        .from('layout_skeletons')
        .select('*')
        .eq('type', type)
        .eq('scope', scope)
        .eq('is_active', true)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching active layout:', error);
        return null;
      }

      return data as LayoutSkeleton;
    } catch (error) {
      console.error('Error in getActiveLayout:', error);
      return null;
    }
  },

  /**
   * Save a layout skeleton to the database
   */
  async saveLayout(layout: Partial<LayoutSkeleton>): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const isUpdate = !!layout.id;
      
      if (isUpdate) {
        const { data, error } = await supabase
          .from('layout_skeletons')
          .update({
            name: layout.name,
            type: layout.type,
            scope: layout.scope,
            layout_json: layout.layout_json,
            is_active: layout.is_active,
            is_locked: layout.is_locked,
            description: layout.description,
            version: layout.version || 1,
          })
          .eq('id', layout.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating layout:', error);
          return { success: false, error: error.message };
        }

        return { success: true, id: data.id };
      } else {
        const { data, error } = await supabase
          .from('layout_skeletons')
          .insert({
            name: layout.name,
            type: layout.type,
            scope: layout.scope,
            layout_json: layout.layout_json,
            is_active: layout.is_active || true,
            is_locked: layout.is_locked || false,
            description: layout.description,
            version: layout.version || 1,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating layout:', error);
          return { success: false, error: error.message };
        }

        return { success: true, id: data.id };
      }
    } catch (error: any) {
      console.error('Error in saveLayout:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Set a layout as active and make all others of the same type/scope inactive
   */
  async setLayoutActive(id: string, type: string, scope: string): Promise<{ success: boolean; error?: string }> {
    try {
      // First set all other layouts to inactive
      const { error: deactivateError } = await supabase
        .from('layout_skeletons')
        .update({ is_active: false })
        .eq('type', type)
        .eq('scope', scope)
        .neq('id', id);

      if (deactivateError) {
        console.error('Error deactivating other layouts:', deactivateError);
        return { success: false, error: deactivateError.message };
      }

      // Then set the selected layout to active
      const { error: activateError } = await supabase
        .from('layout_skeletons')
        .update({ is_active: true })
        .eq('id', id);

      if (activateError) {
        console.error('Error activating layout:', activateError);
        return { success: false, error: activateError.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in setLayoutActive:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete a layout skeleton
   */
  async deleteLayout(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      // First check if this is the only active layout
      const { data: layoutData, error: layoutError } = await supabase
        .from('layout_skeletons')
        .select('*')
        .eq('id', id)
        .single();

      if (layoutError) {
        console.error('Error checking layout before delete:', layoutError);
        return { success: false, error: layoutError.message };
      }

      if (layoutData.is_active) {
        const { count, error: countError } = await supabase
          .from('layout_skeletons')
          .select('*', { count: 'exact', head: true })
          .eq('type', layoutData.type)
          .eq('scope', layoutData.scope)
          .eq('is_active', true);

        if (countError) {
          console.error('Error counting active layouts:', countError);
          return { success: false, error: countError.message };
        }

        if (count === 1) {
          return { 
            success: false, 
            error: 'Cannot delete the only active layout. Create another active layout first or set another layout as active.' 
          };
        }
      }

      // Proceed with deletion
      const { error } = await supabase
        .from('layout_skeletons')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting layout:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in deleteLayout:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Convert database layout to component layout
   */
  convertToLayout(skeleton: LayoutSkeleton): Layout | null {
    try {
      // Try to parse the layout_json field
      const layoutData = {
        id: skeleton.id,
        name: skeleton.name,
        type: skeleton.type,
        scope: skeleton.scope,
        components: Array.isArray(skeleton.layout_json.components) 
          ? skeleton.layout_json.components 
          : [],
        version: skeleton.version,
        meta: {
          description: skeleton.description,
          created_at: skeleton.created_at,
          updated_at: skeleton.updated_at,
          is_locked: skeleton.is_locked,
          created_by: skeleton.created_by,
        }
      };

      // Validate with zod schema
      const validatedLayout = LayoutSchema.parse(layoutData);
      return validatedLayout;
    } catch (error) {
      console.error('Error converting layout skeleton to layout:', error);
      toast.error("Layout validation error", {
        description: "The layout from the database couldn't be parsed correctly"
      });
      return null;
    }
  }
};
