
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface APIKeyRequest {
  action: 'create' | 'delete' | 'update';
  name: string;
  key_type: 'openai' | 'stability' | 'replicate' | 'custom';
  description?: string;
  metadata?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, name, key_type, description, metadata }: APIKeyRequest = await req.json();
    const reference_key = `${key_type}_${name}_KEY`.toLowerCase().replace(/ /g, '_');

    switch (action) {
      case 'create': {
        // Store metadata in the database with additional fields
        const { error } = await supabaseClient
          .from('api_keys')
          .insert({
            name,
            key_type,
            reference_key,
            description: description || null,
            metadata: metadata || {},
            is_active: true,
          });

        if (error) throw error;
        
        console.log(`API key metadata created for: ${name} (${key_type})`);
        break;
      }

      case 'update': {
        const { error } = await supabaseClient
          .from('api_keys')
          .update({
            description,
            metadata,
            updated_at: new Date().toISOString(),
          })
          .eq('reference_key', reference_key);

        if (error) throw error;
        
        console.log(`API key updated: ${reference_key}`);
        break;
      }

      case 'delete': {
        // Remove metadata from the database
        const { error } = await supabaseClient
          .from('api_keys')
          .delete()
          .eq('reference_key', reference_key);

        if (error) throw error;
        
        console.log(`API key deleted: ${reference_key}`);
        break;
      }

      default:
        throw new Error('Invalid action');
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in manage-api-key function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
