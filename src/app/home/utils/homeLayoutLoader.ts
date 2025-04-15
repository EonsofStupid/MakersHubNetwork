
import { HomeLayout, HomeLayoutSchema, FallbackLayout } from '../schema/homeLayoutSchema';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/shared/ui';

/**
 * Loads home layout configuration from Supabase
 * Falls back to static configuration if fetch fails
 */
export async function loadHomeLayout(): Promise<HomeLayout> {
  try {
    const { data, error } = await supabase
      .from('home_layout')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      throw new Error(`Failed to load layout: ${error.message}`);
    }

    // Validate the data with Zod schema
    const validatedLayout = HomeLayoutSchema.parse(data);
    return validatedLayout;
    
  } catch (error) {
    console.error('Error loading homepage layout:', error);
    // Silent fallback - don't show error to end users
    return FallbackLayout;
  }
}

/**
 * Saves home layout configuration to Supabase
 */
export async function saveHomeLayout(layout: HomeLayout): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('home_layout')
      .upsert({
        id: layout.id,
        section_order: layout.section_order,
        featured_override: layout.featured_override,
        created_by: supabase.auth.getUser().then(res => res.data.user?.id),
        updated_at: new Date().toISOString()
      });

    if (error) {
      throw new Error(`Failed to save layout: ${error.message}`);
    }

    toast({
      title: 'Layout saved',
      description: 'Homepage layout updated successfully',
      variant: 'success'
    });
    
    return true;
  } catch (error) {
    console.error('Error saving homepage layout:', error);
    
    toast({
      title: 'Failed to save layout',
      description: error instanceof Error ? error.message : 'Unknown error',
      variant: 'destructive'
    });
    
    return false;
  }
}
