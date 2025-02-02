import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { handleSecurityEvent } from "./securityHandlers";

export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('Session refresh error:', error);
    return null;
  }
};

export const registerUserSession = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('active_2fa_sessions')
      .insert({
        user_id: userId,
        device_name: 'Browser Session',
        ip_address: null, // In a real app, you'd get this from the request
        user_agent: navigator.userAgent
      });

    if (error) throw error;

    await handleSecurityEvent(userId, 'session_created', 'low');
  } catch (error) {
    console.error('Error registering session:', error);
    toast.error('Failed to register session');
  }
};

export const cleanupUserSessions = async (userId: string) => {
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