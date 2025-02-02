import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

export const initializeGamification = async (
  session: Session,
  profile: any,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  console.log('Starting gamification initialization for user:', session.user.id);
  console.log('Current profile state:', profile);

  if (!profile?.gamification_enabled) {
    console.log('Gamification not enabled, initializing...');
    const { error: initError } = await supabase.rpc('initialize_user_gamification', {
      user_id: session.user.id
    });
    
    if (initError) {
      console.error('Error initializing gamification:', initError);
      toast({
        variant: "destructive",
        title: "Gamification Error",
        description: "Failed to initialize gamification features."
      });
      return false;
    }
    console.log('Gamification initialized successfully');
  } else {
    console.log('Gamification already enabled for user');
  }

  return true;
};

export const handleDailyLogin = async (session: Session) => {
  console.log('Processing daily login points for user:', session.user.id);
  const today = new Date().toISOString().split('T')[0];
  console.log('Processing for date:', today);

  // First check existing points
  const { data: dailyPoints, error: dailyError } = await supabase
    .from('daily_point_totals')
    .select('points_earned, consecutive_days')
    .eq('user_id', session.user.id)
    .eq('date', today)
    .eq('activity_type', 'daily_login')
    .single();

  console.log('Current daily points:', dailyPoints);
  if (dailyError) {
    console.log('Daily points query error (expected if first login):', dailyError.code, dailyError.message);
  }

  // Award activity points
  const { error: pointsError } = await supabase
    .from('user_activity_points')
    .insert({
      user_id: session.user.id,
      activity_type: 'daily_login',
      points: 5,
      metadata: { login_date: today }
    });

  if (pointsError) {
    console.error('Error awarding login points:', pointsError);
    return false;
  }
  console.log('Activity points awarded successfully');

  // Update daily totals
  const { error: dailyTotalError } = await supabase
    .from('daily_point_totals')
    .upsert({
      user_id: session.user.id,
      date: today,
      activity_type: 'daily_login',
      points_earned: (dailyPoints?.points_earned || 0) + 5,
      consecutive_days: (dailyPoints?.consecutive_days || 0) + 1
    });

  if (dailyTotalError) {
    console.error('Error updating daily totals:', dailyTotalError);
    return false;
  }
  
  console.log('Daily totals updated successfully:', {
    points_earned: (dailyPoints?.points_earned || 0) + 5,
    consecutive_days: (dailyPoints?.consecutive_days || 0) + 1
  });

  return true;
};