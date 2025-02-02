import { supabase } from '@/integrations/supabase/client';

export const checkRateLimit = async (
  userId: string,
  actionType: string,
  maxCount: number,
  timeWindow: string
): Promise<boolean> => {
  const { data, error } = await supabase.rpc('check_rate_limit', {
    p_user_id: userId,
    p_action_type: actionType,
    p_max_count: maxCount,
    p_time_window: timeWindow
  });

  if (error) {
    console.error('Rate limit check failed:', error);
    return false;
  }

  return data;
};