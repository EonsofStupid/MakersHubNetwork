import { supabase } from '@/integrations/supabase/client';

export const logSecurityEvent = async (
  userId: string,
  actionType: string,
  ipAddress?: string,
  userAgent?: string,
  metadata?: any
) => {
  const { data, error } = await supabase
    .from('security_audit_logs')
    .insert({
      user_id: userId,
      action_type: actionType,
      ip_address: ipAddress,
      user_agent: userAgent,
      metadata
    });

  if (error) {
    console.error('Failed to log security event:', error);
    throw error;
  }

  return data;
};