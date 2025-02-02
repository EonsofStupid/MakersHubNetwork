import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const initializeGamification = async (
  session: Session, 
  profile: any
) => {
  try {
    if (!profile.gamification_enabled) {
      const { error } = await supabase.rpc('initialize_user_gamification', {
        user_id: session.user.id
      });
      
      if (error) throw error;
      
      return true;
    }
    return true;
  } catch (error) {
    console.error('Failed to initialize gamification:', error);
    toast({
      variant: "destructive",
      title: "Gamification Error",
      description: "Failed to initialize gamification features.",
    });
    return false;
  }
};

export const handleDailyLogin = async (session: Session) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        last_login_at: new Date().toISOString()
      })
      .eq('id', session.user.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to handle daily login:', error);
    return false;
  }
};