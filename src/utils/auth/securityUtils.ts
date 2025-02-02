import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const MAX_CONCURRENT_SESSIONS = 3;
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const checkConcurrentSessions = async (userId: string): Promise<boolean> => {
  try {
    const { data: sessions, error } = await supabase
      .from('active_2fa_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) throw error;

    return (sessions?.length || 0) < MAX_CONCURRENT_SESSIONS;
  } catch (error) {
    console.error('Error checking concurrent sessions:', error);
    return true; // Fail open to prevent lockouts
  }
};

export const registerSession = async (
  userId: string,
  deviceName: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('active_2fa_sessions')
      .insert({
        user_id: userId,
        device_name: deviceName,
        ip_address: ipAddress,
        user_agent: userAgent,
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error registering session:', error);
    toast.error('Failed to register session');
  }
};

export const deactivateSession = async (sessionId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('active_2fa_sessions')
      .update({ is_active: false })
      .eq('id', sessionId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deactivating session:', error);
  }
};

export const cleanupInactiveSessions = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('active_2fa_sessions')
      .delete()
      .eq('user_id', userId)
      .eq('is_active', false);

    if (error) throw error;
  } catch (error) {
    console.error('Error cleaning up sessions:', error);
  }
};

export const logSecurityEvent = async (
  userId: string,
  eventType: string,
  severity: 'low' | 'medium' | 'high',
  details: Record<string, any> = {}
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('security_events')
      .insert({
        user_id: userId,
        event_type: eventType,
        severity,
        details,
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error logging security event:', error);
  }
};