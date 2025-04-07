
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

// Initialize Supabase client with service role for admin privileges
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  {
    auth: {
      persistSession: false,
    }
  }
);

// Fallback theme tokens if database fails
const fallbackTokens = {
  primary: "186 100% 50%",
  secondary: "334 100% 59%",
  accent: "262 80% 50%",
  background: "228 47% 8%",
  foreground: "210 40% 98%",
  card: "228 47% 11%",
  cardForeground: "210 40% 98%", 
  muted: "228 47% 15%",
  mutedForeground: "215 20% 65%",
  border: "228 47% 15%",
  input: "228 47% 15%",
  ring: "228 47% 20%",
  effectPrimary: "#00F0FF",
  effectSecondary: "#FF2D6E",
  effectTertiary: "#8B5CF6",
  transitionFast: "150ms",
  transitionNormal: "300ms",
  transitionSlow: "500ms",
  radiusSm: "0.25rem",
  radiusMd: "0.5rem",
  radiusLg: "0.75rem",
  radiusFull: "9999px",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Theme service received request");
    
    // Parse request body
    const { context = 'site', id, name, isDefault = true } = await req.json();
    
    console.log(`Loading theme with params: context=${context}, id=${id}, name=${name}, isDefault=${isDefault}`);

    // Check the database if the themes table exists
    const { data: tablesExist } = await supabaseAdmin.rpc('check_table_exists', { table_name: 'themes' });
    
    if (!tablesExist) {
      console.warn('Themes table does not exist yet, returning fallback tokens');
      return new Response(
        JSON.stringify({ tokens: fallbackTokens }),
        { headers: corsHeaders }
      );
    }

    // Try to fetch theme from database
    let query = supabaseAdmin
      .from('themes')
      .select('*');
    
    // Apply filters based on available parameters
    if (id) {
      query = query.eq('id', id);
    } else if (name) {
      query = query.eq('name', name);
    } else {
      query = query.eq('context', context).eq('is_default', isDefault);
    }

    const { data: theme, error } = await query.single();

    if (error) {
      console.error('Error fetching theme:', error);
      
      // Return fallback data on error
      return new Response(
        JSON.stringify({ 
          tokens: fallbackTokens,
          error: error.message
        }),
        { headers: corsHeaders }
      );
    }

    if (!theme) {
      console.warn(`No theme found for context: ${context}, using fallback`);
      
      // Return fallback data when no theme found
      return new Response(
        JSON.stringify({ tokens: fallbackTokens }),
        { headers: corsHeaders }
      );
    }

    // Extract tokens from the theme's design_tokens
    const tokens = {
      ...(theme.design_tokens?.colors || {}),
      ...(theme.design_tokens?.effects || {})
    };
    
    // Ensure all required token values have fallbacks
    const safeTokens = {
      ...fallbackTokens,
      ...tokens
    };

    console.log(`Theme loaded successfully: ${theme.name}`);

    // Return tokens and theme metadata
    return new Response(
      JSON.stringify({
        tokens: safeTokens,
        theme: {
          id: theme.id,
          name: theme.name,
          context: theme.context,
          is_default: theme.is_default,
          design_tokens: theme.design_tokens,
          component_tokens: theme.component_tokens
        }
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Theme service error:', error);
    
    // Return fallback data on any error
    return new Response(
      JSON.stringify({ 
        tokens: fallbackTokens,
        error: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
