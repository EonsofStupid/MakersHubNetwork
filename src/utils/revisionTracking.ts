import { supabase } from "@/integrations/supabase/client";

export type RevisionType = 'create' | 'update' | 'delete';

export const trackComponentRevision = async (
  componentType: string,
  componentId: string,
  changes: Record<string, any>,
  revisionType: RevisionType
) => {
  const { error } = await supabase
    .from('revision_history')
    .insert({
      entity_type: `component_${componentType}`,
      entity_id: componentId,
      changes,
      revision_type: revisionType,
    });

  if (error) throw error;
};