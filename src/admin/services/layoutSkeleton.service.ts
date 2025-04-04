
import { supabase } from '@/integrations/supabase/client';
import { LayoutSkeleton, Layout, LayoutJsonData, CreateLayoutResponse, Component } from '@/admin/types/layout.types';
import { getLogger } from '@/logging';
import { LogCategory } from '@/constants/logLevel';

const logger = getLogger('layoutSkeletonService', { category: LogCategory.ADMIN });

/**
 * Safely process layout JSON data to ensure compatibility with PostgreSQL JSON type
 */
function processLayoutJson(layoutJson: LayoutJsonData): any {
  try {
    return {
      components: layoutJson.components || [],
      version: layoutJson.version || 1,
      meta: layoutJson.meta || {}
    };
  } catch (err) {
    logger.error('Error processing layout JSON', { details: { error: err } });
    return {
      components: [],
      version: 1,
      meta: {}
    };
  }
}

/**
 * Parse layout JSON from database result
 */
function parseLayoutJson(data: any): LayoutJsonData {
  if (!data) {
    return { components: [], version: 1 };
  }
  
  try {
    // Handle already parsed JSON or string
    const jsonData = typeof data === 'string' ? JSON.parse(data) : data;
    
    return {
      components: Array.isArray(jsonData.components) ? jsonData.components : [],
      version: typeof jsonData.version === 'number' ? jsonData.version : 1,
      meta: jsonData.meta || {}
    };
  } catch (err) {
    logger.error('Error parsing layout JSON', { details: { error: err } });
    return { components: [], version: 1 };
  }
}

/**
 * Get a layout skeleton by ID
 */
async function getById(id: string) {
  try {
    const { data, error } = await supabase
      .from('layout_skeletons')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      logger.error('Error fetching layout by ID', {
        details: { id, error }
      });
      return { data: null, error: error.message };
    }
    
    // Ensure the layout_json has expected structure
    const result: LayoutSkeleton = {
      ...data,
      layout_json: parseLayoutJson(data.layout_json)
    };
    
    return { data: result, error: null };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Exception fetching layout', {
      details: { id, error: errorMsg }
    });
    return { data: null, error: errorMsg };
  }
}

/**
 * Get all layout skeletons with optional filtering
 */
async function getAll(options?: {
  type?: string;
  scope?: string;
  isActive?: boolean;
}) {
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
      logger.error('Error fetching layouts', {
        details: { options, error }
      });
      return { data: null, error: error.message };
    }
    
    // Ensure each layout_json has expected structure
    const results: LayoutSkeleton[] = data.map(item => ({
      ...item,
      layout_json: parseLayoutJson(item.layout_json)
    }));
    
    return { data: results, error: null };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Exception fetching layouts', {
      details: { options, error: errorMsg }
    });
    return { data: null, error: errorMsg };
  }
}

/**
 * Get a layout by type and scope
 */
async function getByTypeAndScope(type: string, scope: string) {
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
      logger.error('Error fetching layout by type and scope', {
        details: { type, scope, error }
      });
      return { data: null, error: error.message };
    }
    
    // Ensure the layout_json has expected structure
    const result: LayoutSkeleton = {
      ...data,
      layout_json: parseLayoutJson(data.layout_json)
    };
    
    return { data: result, error: null };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Exception fetching layout by type and scope', {
      details: { type, scope, error: errorMsg }
    });
    return { data: null, error: errorMsg };
  }
}

/**
 * Create a new layout skeleton
 */
async function create(layout: Partial<LayoutSkeleton>): Promise<CreateLayoutResponse> {
  try {
    if (!layout.name || !layout.type || !layout.scope) {
      return { success: false, error: 'Missing required fields' };
    }
    
    const layoutData = {
      name: layout.name,
      type: layout.type,
      scope: layout.scope,
      description: layout.description || null,
      is_active: layout.is_active !== undefined ? layout.is_active : true,
      is_locked: layout.is_locked !== undefined ? layout.is_locked : false,
      layout_json: processLayoutJson(layout.layout_json || { components: [], version: 1 }),
      version: layout.version || 1
    };
    
    const { data, error } = await supabase
      .from('layout_skeletons')
      .insert(layoutData)
      .select('*')
      .single();
      
    if (error) {
      logger.error('Error creating layout', {
        details: { layout, error }
      });
      return { success: false, error: error.message };
    }
    
    // Ensure the layout_json has expected structure
    const result: LayoutSkeleton = {
      ...data,
      layout_json: parseLayoutJson(data.layout_json)
    };
    
    return { success: true, data: result, id: result.id };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Exception creating layout', {
      details: { layout, error: errorMsg }
    });
    return { success: false, error: errorMsg };
  }
}

/**
 * Update an existing layout skeleton
 */
async function update(id: string, layout: Partial<LayoutSkeleton>): Promise<CreateLayoutResponse> {
  try {
    const updateData: Record<string, any> = {};
    
    if (layout.name) updateData.name = layout.name;
    if (layout.type) updateData.type = layout.type;
    if (layout.scope) updateData.scope = layout.scope;
    if (layout.description !== undefined) updateData.description = layout.description;
    if (layout.is_active !== undefined) updateData.is_active = layout.is_active;
    if (layout.is_locked !== undefined) updateData.is_locked = layout.is_locked;
    if (layout.version) updateData.version = layout.version;
    if (layout.layout_json) {
      updateData.layout_json = processLayoutJson(layout.layout_json);
    }
    
    const { data, error } = await supabase
      .from('layout_skeletons')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();
      
    if (error) {
      logger.error('Error updating layout', {
        details: { id, layout, error }
      });
      return { success: false, error: error.message };
    }
    
    // Ensure the layout_json has expected structure
    const result: LayoutSkeleton = {
      ...data,
      layout_json: parseLayoutJson(data.layout_json)
    };
    
    return { success: true, data: result, id };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Exception updating layout', {
      details: { id, layout, error: errorMsg }
    });
    return { success: false, error: errorMsg };
  }
}

/**
 * Delete a layout skeleton
 */
async function deleteLayout(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('layout_skeletons')
      .delete()
      .eq('id', id);
      
    if (error) {
      logger.error('Error deleting layout', {
        details: { id, error }
      });
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Exception deleting layout', {
      details: { id, error: errorMsg }
    });
    return { success: false, error: errorMsg };
  }
}

/**
 * Save a layout (create or update)
 */
async function saveLayout(layout: Partial<LayoutSkeleton>): Promise<CreateLayoutResponse> {
  if (layout.id) {
    return update(layout.id, layout);
  } else {
    return create(layout);
  }
}

/**
 * Convert a LayoutSkeleton to a Layout
 */
function convertToLayout(skeleton: LayoutSkeleton): Layout {
  return {
    id: skeleton.id,
    name: skeleton.name,
    type: skeleton.type,
    scope: skeleton.scope,
    description: skeleton.description || '',
    components: skeleton.layout_json.components || [],
    version: skeleton.version,
    created_at: skeleton.created_at,
    updated_at: skeleton.updated_at,
    is_active: skeleton.is_active,
    is_locked: skeleton.is_locked,
    meta: skeleton.meta
  };
}

export const layoutSkeletonService = {
  getById,
  getAll,
  getByTypeAndScope,
  create,
  update,
  delete: deleteLayout,
  saveLayout,
  convertToLayout
};
