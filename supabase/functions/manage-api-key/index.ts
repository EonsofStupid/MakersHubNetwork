
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
};

interface APIKeyRequest {
  action: 'create' | 'delete' | 'update';
  name: string;
  key_type: 'openai' | 'stability' | 'replicate' | 'custom';
  api_key: string;
  description?: string;
  metadata?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Check if request method is POST
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get session JWT and verify admin status
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Verify admin role
    const { data: roles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const isAdmin = roles?.some(r => r.role === 'super_admin' || r.role === 'admin');
    if (!isAdmin) {
      throw new Error('Unauthorized - Admin access required');
    }

    const { action, name, key_type, api_key, description, metadata }: APIKeyRequest = await req.json();
    console.log(`Processing ${action} request for key: ${name}`);

    const reference_key = `${key_type}_${name}_KEY`.toLowerCase().replace(/ /g, '_');

    switch (action) {
      case 'create': {
        // Validate inputs
        if (!api_key || !name || !key_type) {
          throw new Error('Missing required fields');
        }

        // Store the encrypted API key in vault
        const { data: vaultData, error: vaultError } = await supabaseClient.rpc(
          'create_secret',
          { 
            name: reference_key,
            secret: api_key,
            key_id: null  // Use default encryption key
          }
        );

        if (vaultError) {
          console.error('Vault error:', vaultError);
          throw new Error('Failed to securely store API key');
        }

        // Store metadata in api_keys table
        const { error: dbError } = await supabaseClient
          .from('api_keys')
          .insert({
            name,
            key_type,
            reference_key,
            description: description || null,
            metadata: {
              ...metadata || {},
              created_by: user.id,
              created_at: new Date().toISOString(),
            },
            is_active: true,
            created_by: user.id,
          });

        if (dbError) {
          console.error('Database error:', dbError);
          // Try to cleanup vault entry if database insert fails
          await supabaseClient.rpc('delete_secret', { name: reference_key });
          throw new Error('Failed to store API key metadata');
        }

        console.log(`Successfully stored API key: ${name}`);
        break;
      }

      case 'delete': {
        // Delete from vault first
        const { error: vaultError } = await supabaseClient.rpc(
          'delete_secret',
          { name: reference_key }
        );

        if (vaultError) {
          console.error('Vault error:', vaultError);
          throw new Error('Failed to delete API key from secure storage');
        }

        // Then remove metadata
        const { error: dbError } = await supabaseClient
          .from('api_keys')
          .delete()
          .eq('reference_key', reference_key);

        if (dbError) {
          console.error('Database error:', dbError);
          throw new Error('Failed to delete API key metadata');
        }

        console.log(`Successfully deleted API key: ${name}`);
        break;
      }

      case 'update': {
        const { error: dbError } = await supabaseClient
          .from('api_keys')
          .update({
            description,
            metadata: {
              ...metadata || {},
              updated_by: user.id,
              updated_at: new Date().toISOString(),
            },
            updated_at: new Date().toISOString(),
          })
          .eq('reference_key', reference_key);

        if (dbError) {
          console.error('Database error:', dbError);
          throw new Error('Failed to update API key metadata');
        }

        console.log(`Successfully updated API key: ${name}`);
        break;
      }

      default:
        throw new Error('Invalid action');
    }

    return new Response(
      JSON.stringify({ success: true }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in manage-api-key function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error.toString()
      }),
      {
        status: error.message === 'Unauthorized' ? 401 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
