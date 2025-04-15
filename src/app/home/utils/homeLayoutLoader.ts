
import { HomeLayout, HomeLayoutSchema, FallbackLayout } from '../schema/homeLayoutSchema';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/shared/ui';

export async function loadHomeLayout(): Promise<HomeLayout> {
  try {
    const { data, error } = await supabase
      .from('home_layout')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    const validatedLayout = HomeLayoutSchema.parse(data);
    return validatedLayout;
    
  } catch (error) {
    console.error('Error loading homepage layout:', error);
    return FallbackLayout;
  }
}

export async function saveHomeLayout(layout: HomeLayout): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('home_layout')
      .upsert({
        ...layout,
        created_by: (await supabase.auth.getUser()).data.user?.id,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;

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
