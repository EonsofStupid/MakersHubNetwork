
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
    let params;
    try {
      params = await req.json();
    } catch (e) {
      // If JSON parsing fails, try to get parameters from URL
      const url = new URL(req.url);
      params = {
        context: url.searchParams.get('context') || 'site',
        id: url.searchParams.get('id'),
        name: url.searchParams.get('name'),
        isDefault: url.searchParams.get('isDefault') !== 'false'
      };
    }
    
    const { context = 'site', id, name, isDefault = true } = params;
    
    console.log(`Loading theme with params: context=${context}, id=${id}, name=${name}, isDefault=${isDefault}`);

    // Check if the themes table exists using a simple direct query instead of RPC
    let tablesExist = false;
    try {
      // Direct query to check if the table exists and has content
      const tableCheck = await supabaseAdmin
        .from('themes')
        .select('count')
        .limit(1);
      
      // If we can query the table without error, it exists
      tablesExist = !tableCheck.error;
      
      if (tableCheck.error) {
        console.log('Table check error:', tableCheck.error);
      } else {
        console.log('Table exists check successful');
      }
    } catch (error) {
      console.warn('Error checking if themes table exists:', error);
      tablesExist = false;
    }
    
    if (!tablesExist) {
      console.warn('Themes table does not exist yet, returning fallback tokens');
      return new Response(
        JSON.stringify({ 
          tokens: fallbackTokens,
          theme: null,
          isFallback: true 
        }),
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
      query = query.eq('context', context);
      if (isDefault) {
        query = query.eq('is_default', true);
      }
    }

    const { data: theme, error } = await query.maybeSingle();

    if (error) {
      console.error('Error fetching theme:', error);
      
      // Return fallback data on error
      return new Response(
        JSON.stringify({ 
          tokens: fallbackTokens,
          error: error.message,
          theme: null,
          isFallback: true
        }),
        { headers: corsHeaders }
      );
    }

    if (!theme) {
      console.warn(`No theme found for context: ${context}, using fallback`);
      
      // Return fallback data when no theme found
      return new Response(
        JSON.stringify({ 
          tokens: fallbackTokens,
          theme: null,
          isFallback: true
        }),
        { headers: corsHeaders }
      );
    }

    // Extract tokens from the theme's design_tokens
    const colorsTokens = theme.design_tokens?.colors || {};
    const effectsTokens = theme.design_tokens?.effects || {};
    
    // Combine colors and effects tokens with fallbacks
    const safeTokens = {
      ...fallbackTokens,
      ...colorsTokens,
      effectPrimary: effectsTokens.primary || fallbackTokens.effectPrimary,
      effectSecondary: effectsTokens.secondary || fallbackTokens.effectSecondary,
      effectTertiary: effectsTokens.tertiary || fallbackTokens.effectTertiary
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
          status: theme.status,
          is_default: theme.is_default,
          created_at: theme.created_at,
          updated_at: theme.updated_at,
          design_tokens: theme.design_tokens,
          component_tokens: theme.component_tokens
        },
        isFallback: false
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Theme service error:', error);
    
    // Return fallback data on any error
    return new Response(
      JSON.stringify({ 
        tokens: fallbackTokens,
        error: error instanceof Error ? error.message : String(error),
        theme: null,
        isFallback: true
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
