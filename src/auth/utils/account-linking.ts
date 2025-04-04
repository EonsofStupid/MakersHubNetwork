
import { supabase } from '@/integrations/supabase/client';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging/types';
import { safeDetails } from '@/logging/utils/safeDetails';

const logger = getLogger('AccountLinking', { category: LogCategory.AUTHENTICATION });

/**
 * Get all linked providers for the current user
 */
export async function getLinkedProviders() {
  try {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return [];
    
    const identities = data.user.identities || [];
    return identities.map(identity => identity.provider);
  } catch (error) {
    logger.error('Failed to get linked providers', { details: safeDetails(error) });
    return [];
  }
}

/**
 * Check if a provider is already linked to the user's account
 */
export async function isProviderLinked(providerName: string): Promise<boolean> {
  const providers = await getLinkedProviders();
  return providers.includes(providerName);
}

/**
 * Unlink a provider from the user's account
 * Note: This requires the unlink_provider function to be set up in Supabase Edge Functions
 */
export async function unlinkProvider(providerName: string) {
  try {
    logger.info('Attempting to unlink provider', { details: { provider: providerName } });
    
    // This would need a custom Edge Function in Supabase
    const { error } = await supabase.functions.invoke('unlink-provider', {
      body: { provider: providerName }
    });
    
    if (error) {
      throw error;
    }
    
    logger.info('Provider unlinked successfully', { details: { provider: providerName } });
    return true;
  } catch (error) {
    logger.error('Failed to unlink provider', { 
      details: { 
        provider: providerName,
        error: safeDetails(error)
      } 
    });
    return false;
  }
}

/**
 * Process Google linking after OAuth redirect
 */
export async function processGoogleLinking() {
  const url = new URL(window.location.href);
  const isLinking = url.searchParams.get('linking') === 'true';
  
  if (!isLinking) return false;
  
  try {
    logger.info('Processing Google account linking after redirect');
    
    // The linking itself is handled automatically by Supabase
    // when the user authenticates with Google while already logged in
    
    logger.info('Google account linked successfully');
    return true;
  } catch (error) {
    logger.error('Error processing Google account linking', { details: safeDetails(error) });
    return false;
  }
}
