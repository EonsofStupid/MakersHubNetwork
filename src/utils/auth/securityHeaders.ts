import { supabase } from '@/integrations/supabase/client';

export const applySecurityHeaders = async () => {
  try {
    console.log('Requesting security headers application...');
    
    const { data, error } = await supabase.functions.invoke('security-headers', {
      method: 'POST',
    });
    
    if (error) {
      console.error('Failed to apply security headers:', error);
      return false;
    }
    
    console.log('Security headers applied successfully:', data);
    return true;
  } catch (error) {
    console.error('Error applying security headers:', error);
    return false;
  }
};