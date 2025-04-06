
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
  primary: "#00F0FF",
  secondary: "#FF2D6E",
  accent: "#8B5CF6",
  background: "#080F1E",
  foreground: "#F9FAFB",
  card: "#0E172A",
  cardForeground: "#F9FAFB", 
  muted: "#131D35",
  mutedForeground: "#94A3B8",
  border: "#131D35",
  input: "#131D35",
  ring: "#1E293B",
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
    // Parse URL and get scope parameter (for backward compatibility)
    const url = new URL(req.url);
    // Support both 'scope' and 'context' parameters, defaulting to 'app' context
    const scopeOrContext = url.searchParams.get('scope') || url.searchParams.get('context') || 'app';
    
    console.log(`Loading theme for context: ${scopeOrContext}`);

    // Query for theme by context and default status
    const { data: theme, error } = await supabaseAdmin
      .from('themes')
      .select('*')
      .eq('context', scopeOrContext) // Use context instead of scope
      .eq('is_default', true)
      .single();

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
      console.warn(`No theme found for context: ${scopeOrContext}, using fallback`);
      
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

    // Get tokens from theme design_tokens or use fallback
    const tokens = theme.design_tokens?.colors || fallbackTokens;
    
    console.log(`Theme loaded successfully: ${theme.name}`);

    // Return tokens and theme metadata
    return new Response(
      JSON.stringify({
        tokens,
        theme: {
          id: theme.id,
          name: theme.name,
          context: theme.context,
          status: theme.status,
          isDefault: theme.is_default,
          createdAt: theme.created_at,
          updatedAt: theme.updated_at,
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
