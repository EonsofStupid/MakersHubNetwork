
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, name, key_type } = await req.json();
    const reference_key = `${key_type}_${name}_KEY`.toLowerCase().replace(/ /g, '_');

    switch (action) {
      case 'create': {
        // Store metadata in the database
        const { error } = await supabaseClient
          .from('api_keys')
          .insert({
            name,
            key_type,
            reference_key,
            is_active: true,
          });

        if (error) throw error;
        break;
      }

      case 'delete': {
        // Remove metadata from the database
        const { error } = await supabaseClient
          .from('api_keys')
          .delete()
          .eq('reference_key', reference_key);

        if (error) throw error;
        break;
      }

      default:
        throw new Error('Invalid action');
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
