
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ApiKeyRequest {
  action: 'create' | 'update' | 'delete' | 'get';
  name?: string;
  key_type?: string;
  api_key?: string;
  description?: string;
  id?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Get the requesting user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Check if user is super_admin
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!roles || roles.role !== 'super_admin') {
      throw new Error('Insufficient permissions')
    }

    const { action, ...data } = await req.json() as ApiKeyRequest

    let result

    switch (action) {
      case 'create': {
        // Validate the API key format using the database function
        const { data: validationResult } = await supabase.rpc(
          'validate_api_key_format',
          { key_text: data.api_key, provider: data.key_type }
        )

        if (!validationResult) {
          throw new Error('Invalid API key format')
        }

        const { data: newKey, error } = await supabase
          .from('api_keys')
          .insert({
            name: data.name,
            key_type: data.key_type,
            reference_key: data.api_key,
            description: data.description,
            created_by: user.id
          })
          .select()
          .single()

        if (error) throw error
        result = newKey

        // Log the creation
        await supabase
          .from('api_key_audit_logs')
          .insert({
            action: 'create',
            api_key_id: result.id,
            performed_by: user.id,
            metadata: { name: data.name, key_type: data.key_type }
          })

        break
      }

      case 'get': {
        const { data: keys, error } = await supabase
          .from('api_keys')
          .select('id, name, key_type, description, created_at, last_used_at, access_count, is_active')
          .order('created_at', { ascending: false })

        if (error) throw error
        result = keys
        break
      }

      case 'update': {
        if (!data.id) throw new Error('No key ID provided')

        const { data: updatedKey, error } = await supabase
          .from('api_keys')
          .update({
            name: data.name,
            description: data.description,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id)
          .select()
          .single()

        if (error) throw error
        result = updatedKey

        // Log the update
        await supabase
          .from('api_key_audit_logs')
          .insert({
            action: 'update',
            api_key_id: data.id,
            performed_by: user.id,
            metadata: { name: data.name }
          })

        break
      }

      case 'delete': {
        if (!data.id) throw new Error('No key ID provided')

        // Log the deletion first
        await supabase
          .from('api_key_audit_logs')
          .insert({
            action: 'delete',
            api_key_id: data.id,
            performed_by: user.id
          })

        const { error } = await supabase
          .from('api_keys')
          .delete()
          .eq('id', data.id)

        if (error) throw error
        result = { success: true }
        break
      }

      default:
        throw new Error('Invalid action')
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
