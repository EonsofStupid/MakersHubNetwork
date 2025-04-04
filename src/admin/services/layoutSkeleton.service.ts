
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { LayoutSkeleton, Layout, layoutToJson, LayoutJsonData } from "@/admin/types/layout.types";
import { safeJsonParse } from "@/utils/jsonUtils";

interface LayoutResponse {
  data: LayoutSkeleton | null;
  error: PostgrestError | Error | null;
}

interface LayoutsResponse {
  data: LayoutSkeleton[] | null;
  error: PostgrestError | Error | null;
}

interface CreateLayoutResponse {
  success: boolean;
  data?: LayoutSkeleton;
  id?: string;
  error?: string;
}

interface UpdateLayoutResponse {
  success: boolean;
  data?: LayoutSkeleton;
  error?: string;
}

interface DeleteLayoutResponse {
  success: boolean;
  error?: string;
}

class LayoutSkeletonService {
  /**
   * Get a single layout by id
   */
  async getById(id: string): Promise<LayoutResponse> {
    try {
      const { data, error } = await supabase
        .from('layout_skeletons')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error };
      }

      return { 
        data: this.transformDatabaseResponse(data), 
        error: null 
      };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error(String(error)) 
      };
    }
  }

  /**
   * Get a layout by type and scope
   */
  async getByTypeAndScope(type: string, scope: string): Promise<LayoutResponse> {
    try {
      const { data, error } = await supabase
        .from('layout_skeletons')
        .select('*')
        .eq('type', type)
        .eq('scope', scope)
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned, not really an error
          return { data: null, error: null };
        }
        return { data: null, error };
      }

      return { 
        data: this.transformDatabaseResponse(data), 
        error: null 
      };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error(String(error)) 
      };
    }
  }

  /**
   * Get all layouts with optional filtering
   */
  async getAll(options?: {
    type?: string;
    scope?: string;
    isActive?: boolean;
  }): Promise<LayoutsResponse> {
    try {
      let query = supabase.from('layout_skeletons').select('*');

      if (options?.type) {
        query = query.eq('type', options.type);
      }

      if (options?.scope) {
        query = query.eq('scope', options.scope);
      }

      if (options?.isActive !== undefined) {
        query = query.eq('is_active', options.isActive);
      }

      const { data, error } = await query.order('updated_at', { ascending: false });

      if (error) {
        return { data: null, error };
      }

      return { 
        data: data.map(this.transformDatabaseResponse), 
        error: null 
      };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error(String(error)) 
      };
    }
  }

  /**
   * Create a new layout
   */
  async create(layout: Partial<LayoutSkeleton>): Promise<CreateLayoutResponse> {
    try {
      if (!layout.type) {
        return { 
          success: false, 
          error: 'Layout type is required' 
        };
      }

      // Set defaults
      const layoutToInsert = {
        name: layout.name || `${layout.type} Layout`,
        type: layout.type,
        scope: layout.scope || 'global',
        description: layout.description || null,
        is_active: layout.is_active !== undefined ? layout.is_active : true,
        is_locked: layout.is_locked !== undefined ? layout.is_locked : false,
        layout_json: layout.layout_json || { components: [], version: 1 },
        version: layout.version || 1
      };

      const { data, error } = await supabase
        .from('layout_skeletons')
        .insert(layoutToInsert)
        .select()
        .single();

      if (error) {
        return { 
          success: false, 
          error: error.message 
        };
      }

      return { 
        success: true, 
        data: this.transformDatabaseResponse(data),
        id: data.id
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  /**
   * Update an existing layout
   */
  async update(id: string, layout: Partial<LayoutSkeleton>): Promise<UpdateLayoutResponse> {
    try {
      const { data, error } = await supabase
        .from('layout_skeletons')
        .update({
          name: layout.name,
          description: layout.description,
          is_active: layout.is_active,
          is_locked: layout.is_locked,
          layout_json: layout.layout_json,
          version: layout.version
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { 
          success: false, 
          error: error.message 
        };
      }

      return { 
        success: true, 
        data: this.transformDatabaseResponse(data) 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  /**
   * Delete a layout
   */
  async delete(id: string): Promise<DeleteLayoutResponse> {
    try {
      const { error } = await supabase
        .from('layout_skeletons')
        .delete()
        .eq('id', id);

      if (error) {
        return { 
          success: false, 
          error: error.message 
        };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  /**
   * Save a layout (create or update)
   */
  async saveLayout(layout: Partial<LayoutSkeleton>): Promise<CreateLayoutResponse> {
    if (layout.id) {
      const result = await this.update(layout.id, layout);
      return {
        success: result.success,
        data: result.data,
        id: result.data?.id,
        error: result.error
      };
    } else {
      return await this.create(layout);
    }
  }

  /**
   * Delete a layout
   */
  async deleteLayout(id: string): Promise<DeleteLayoutResponse> {
    return await this.delete(id);
  }

  /**
   * Convert a LayoutSkeleton to a Layout
   */
  convertToLayout(skeleton: LayoutSkeleton | null): Layout | null {
    if (!skeleton) return null;
    
    const layoutJson = typeof skeleton.layout_json === 'string' 
      ? JSON.parse(skeleton.layout_json) 
      : skeleton.layout_json;
      
    return {
      id: skeleton.id,
      name: skeleton.name,
      type: skeleton.type,
      scope: skeleton.scope,
      description: skeleton.description,
      components: Array.isArray(layoutJson?.components) 
        ? layoutJson.components 
        : [],
      version: skeleton.version,
      created_at: skeleton.created_at,
      updated_at: skeleton.updated_at,
      is_active: skeleton.is_active,
      is_locked: skeleton.is_locked,
      meta: skeleton.meta || {}
    };
  }

  /**
   * Transform database response to our internal type
   */
  private transformDatabaseResponse(data: any): LayoutSkeleton {
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      scope: data.scope,
      description: data.description,
      is_active: data.is_active,
      is_locked: data.is_locked,
      created_at: data.created_at,
      updated_at: data.updated_at,
      created_by: data.created_by,
      layout_json: safeJsonParse(data.layout_json, { components: [], version: 1 }),
      version: data.version || 1,
      meta: data.meta || {}
    };
  }
}

export const layoutSkeletonService = new LayoutSkeletonService();
