
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
}

// Create a fallback theme
const fallbackTheme = {
  id: "fallback-theme-" + Date.now(),
  name: "Emergency Fallback Theme",
  description: "Fallback theme used when theme service is unavailable",
  status: 'published',
  is_default: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  version: 1,
  design_tokens: {
    colors: {
      background: "#080F1E",
      foreground: "#F9FAFB",
      card: "#0E172A",
      cardForeground: "#F9FAFB", 
      primary: "#00F0FF",
      primaryForeground: "#F9FAFB",
      secondary: "#FF2D6E",
      secondaryForeground: "#F9FAFB",
      muted: "#131D35",
      mutedForeground: "#94A3B8",
      accent: "#131D35",
      accentForeground: "#F9FAFB",
      destructive: "#EF4444",
      destructiveForeground: "#F9FAFB",
      border: "#131D35",
      input: "#131D35",
      ring: "#1E293B",
    },
    effects: {
      shadows: {},
      blurs: {},
      gradients: {},
      primary: "#00F0FF",
      secondary: "#FF2D6E",
      tertiary: "#8B5CF6",
    },
    animation: {
      keyframes: {},
      transitions: {},
      durations: {
        fast: "150ms",
        normal: "300ms",
        slow: "500ms",
        animationFast: "1s",
        animationNormal: "2s",
        animationSlow: "3s",
      }
    },
    spacing: {
      radius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        full: "9999px",
      }
    }
  },
  component_tokens: [],
};

// Helper to check if a string is a valid UUID
function isValidUUID(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// Log a message with timestamp and details
function logMessage(message: string, details?: any) {
  console.log(`${new Date().toISOString()} - ${message}`, details || '');
}

// Main function to handle requests
serve(async (req: Request) => {
  try {
    // Check for CORS preflight
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    // Parse the request
    let body;
    try {
      body = await req.json();
    } catch (e) {
      logMessage("Error parsing request JSON:", e);
      return new Response(
        JSON.stringify({ error: "Invalid JSON", details: e.message }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Determine the operation
    const operation = body?.operation;
    if (!operation) {
      return new Response(
        JSON.stringify({ error: "Missing operation parameter" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Process the operation
    switch (operation) {
      case 'get-theme':
        return await getTheme(supabase, body);
      
      case 'update-theme':
        return await updateTheme(supabase, body);
      
      case 'list-themes':
        return await listThemes(supabase, body);
      
      default:
        return new Response(
          JSON.stringify({ error: "Unknown operation" }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
    }
  } catch (error) {
    logMessage("Theme service error:", error);
    
    // Return the fallback theme on any error
    return new Response(
      JSON.stringify({ 
        theme: fallbackTheme, 
        isFallback: true, 
        error: error.message 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

// Get theme function
async function getTheme(supabase, body) {
  try {
    const { themeId, themeName, isDefault = true, context = 'site' } = body;
    
    let query = supabase.from('themes').select('*');
    
    // Handle theme lookup by ID or name properly
    if (themeId) {
      // Check if themeId is a valid UUID
      if (isValidUUID(themeId)) {
        logMessage(`Looking up theme by UUID: ${themeId}`);
        query = query.eq('id', themeId);
      } else {
        // If not a UUID, treat as a name
        logMessage(`ThemeId not a UUID, treating as name: ${themeId}`);
        query = query.eq('name', themeId);
      }
    } else if (themeName) {
      logMessage(`Looking up theme by name: ${themeName}`);
      query = query.eq('name', themeName);
    } else if (isDefault) {
      logMessage('Looking up default theme');
      query = query.eq('is_default', true);
    }
    
    if (context) {
      query = query.eq('context', context);
    }
    
    // Get latest version
    query = query.order('version', { ascending: false }).limit(1);
    
    const { data: themes, error } = await query;
    
    if (error) {
      // Handle database errors gracefully
      logMessage("Database error:", error);
      
      // Check if this is a UUID format error
      if (error.message && error.message.includes("invalid input syntax for type uuid")) {
        // Try looking up by name instead
        logMessage("UUID format error, retrying by name");
        
        // Attempt name-based lookup if we were trying a UUID lookup
        if (themeId && !isValidUUID(themeId)) {
          const { data: themesByName, error: nameError } = await supabase
            .from('themes')
            .select('*')
            .eq('name', themeId)
            .eq('context', context)
            .order('version', { ascending: false })
            .limit(1);
            
          if (!nameError && themesByName && themesByName.length > 0) {
            logMessage(`Successfully found theme by name: ${themeId}`);
            return new Response(
              JSON.stringify({ 
                theme: themesByName[0], 
                isFallback: false,
                lookupMethod: 'name' 
              }),
              { 
                status: 200, 
                headers: { ...corsHeaders, "Content-Type": "application/json" } 
              }
            );
          }
        }
      }
      
      // If all lookups fail, return fallback
      return new Response(
        JSON.stringify({ 
          theme: fallbackTheme, 
          isFallback: true, 
          error: error.message 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    if (!themes || themes.length === 0) {
      logMessage("No theme found, returning fallback");
      return new Response(
        JSON.stringify({ 
          theme: fallbackTheme, 
          isFallback: true
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        theme: themes[0], 
        isFallback: false
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    logMessage("Error getting theme:", error);
    return new Response(
      JSON.stringify({ 
        theme: fallbackTheme, 
        isFallback: true, 
        error: error.message 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
}

// Update theme function
async function updateTheme(supabase, body) {
  try {
    const { themeId, theme } = body;
    
    if (!themeId) {
      return new Response(
        JSON.stringify({ error: "Missing themeId parameter" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Get current theme - handle both UUID and name lookups
    let getQuery = supabase.from('themes').select('*');
    
    if (isValidUUID(themeId)) {
      getQuery = getQuery.eq('id', themeId);
    } else {
      getQuery = getQuery.eq('name', themeId);
    }
    
    const { data: existingThemes, error: getError } = await getQuery;
    
    if (getError || !existingThemes || existingThemes.length === 0) {
      const errorMsg = getError ? getError.message : "Theme not found";
      logMessage("Error getting theme to update:", errorMsg);
      return new Response(
        JSON.stringify({ error: errorMsg }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    const existingTheme = existingThemes[0];
    
    // Update the theme
    const { data, error } = await supabase
      .from('themes')
      .update({
        ...theme,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingTheme.id)
      .select();
    
    if (error) {
      logMessage("Error updating theme:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        theme: data[0] || existingTheme 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    logMessage("Error updating theme:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
}

// List themes function
async function listThemes(supabase, body) {
  try {
    const { context = 'site', limit = 10 } = body;
    
    const { data: themes, error } = await supabase
      .from('themes')
      .select('*')
      .eq('context', context)
      .order('updated_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      logMessage("Error listing themes:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ themes }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    logMessage("Error listing themes:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
}
