
// Theme Service Edge Function
// This function provides access to themes with service role permissions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// Define response headers with CORS support
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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

// Default fallback theme definition
const defaultFallbackTheme = {
  id: "00000000-0000-0000-0000-000000000000",
  name: "Fallback Theme",
  description: "Emergency fallback theme used when theme service is unavailable",
  status: "published",
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
  composition_rules: {},
  cached_styles: {}
};

// Handle incoming requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    let requestData;
    try {
      requestData = await req.json();
      console.log("Received request:", JSON.stringify(requestData));
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Determine which operation to perform
    const { operation } = requestData;

    switch (operation) {
      case 'get-theme':
        return await handleGetTheme(requestData);
      
      case 'update-theme':
        return await handleUpdateTheme(requestData);
      
      case 'create-theme':
        return await handleCreateTheme(requestData);
      
      default:
        console.error("Invalid operation:", operation);
        return new Response(
          JSON.stringify({ error: 'Invalid operation', details: `Operation "${operation}" not supported` }), 
          { status: 400, headers: corsHeaders }
        );
    }
  } catch (error) {
    console.error('Theme service unhandled error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error) 
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});

// Handle get-theme operation
async function handleGetTheme(data) {
  try {
    console.log("Handling get-theme operation with data:", JSON.stringify(data));
    
    const { themeId, themeName, isDefault = true, context = 'site' } = data;
    console.log(`Looking for theme with ID: ${themeId || 'N/A'}, Name: ${themeName || 'N/A'}, isDefault: ${isDefault}, context: ${context}`);

    // Query for the theme
    let query = supabaseAdmin.from('themes').select('*');
    
    // Apply filters based on parameters
    if (themeId && themeId !== 'Impulsivity' && themeId !== 'fallback-theme') {
      // If it looks like a UUID, use it as an ID
      if (themeId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        console.log("Using ID filter:", themeId);
        query = query.eq('id', themeId);
      } else {
        console.log("Using name filter (from themeId field):", themeId);
        query = query.eq('name', themeId);
      }
    } else if (themeName) {
      console.log("Using name filter:", themeName);
      query = query.eq('name', themeName);
    } else if (isDefault) {
      console.log("Using is_default filter");
      query = query.eq('is_default', true);
    }

    // Apply context filter - optional for backward compatibility
    if (context) {
      console.log("Applying context filter:", context);
      query = query.eq('context', context);
    }
    
    // Execute the query
    const { data: themes, error } = await query.limit(1);
    
    // Check for database error
    if (error) {
      console.error('Database error fetching theme:', error);
      return new Response(
        JSON.stringify({ error: 'Database error', details: error.message }),
        { status: 500, headers: corsHeaders }
      );
    }
    
    // Handle no theme found
    if (!themes || themes.length === 0) {
      console.warn('No theme found, returning fallback theme');
      
      // Special case for Impulsivity: create it if it doesn't exist
      if (themeName === 'Impulsivity' || themeId === 'Impulsivity') {
        console.log("Creating Impulsivity theme since it was requested but doesn't exist");
        
        const impulsivityTheme = {
          name: 'Impulsivity',
          description: 'A cyberpunk-inspired theme with neon effects and vivid colors',
          status: 'published',
          is_default: true,
          version: 1,
          context: 'site',
          design_tokens: {
            colors: {
              primary: '#00F0FF',
              secondary: '#FF2D6E',
              background: '#121218',
              foreground: '#F6F6F7' 
            },
            effects: {
              shadows: {},
              blurs: {},
              gradients: {},
              primary: '#00F0FF',
              secondary: '#FF2D6E',
              tertiary: '#8B5CF6'
            }
          },
          component_tokens: []
        };
        
        try {
          const { data: newTheme, error: createError } = await supabaseAdmin
            .from('themes')
            .insert(impulsivityTheme)
            .select()
            .single();
            
          if (createError) {
            throw createError;
          }
          
          if (newTheme) {
            console.log(`Created Impulsivity theme with ID: ${newTheme.id}`);
            return new Response(
              JSON.stringify({ theme: newTheme, isFallback: false }),
              { status: 200, headers: corsHeaders }
            );
          }
        } catch (createError) {
          console.error('Error creating Impulsivity theme:', createError);
          // Fall through to return fallback theme
        }
      }
      
      return new Response(
        JSON.stringify({ theme: defaultFallbackTheme, isFallback: true }),
        { status: 200, headers: corsHeaders }
      );
    }

    // Theme found, return it
    const theme = themes[0];
    
    // Process any serialized fields
    let processedTheme = { ...theme };
    
    try {
      // Parse design_tokens if it's a JSON string
      if (typeof processedTheme.design_tokens === 'string') {
        processedTheme.design_tokens = JSON.parse(processedTheme.design_tokens);
      }
      
      // Parse component_tokens if it's a JSON string
      if (typeof processedTheme.component_tokens === 'string') {
        processedTheme.component_tokens = JSON.parse(processedTheme.component_tokens);
      }
      
      // Parse composition_rules if it's a JSON string
      if (typeof processedTheme.composition_rules === 'string') {
        processedTheme.composition_rules = JSON.parse(processedTheme.composition_rules);
      }
      
      // Parse cached_styles if it's a JSON string
      if (typeof processedTheme.cached_styles === 'string') {
        processedTheme.cached_styles = JSON.parse(processedTheme.cached_styles);
      }
    } catch (parseError) {
      console.warn('Error parsing JSON fields in theme:', parseError);
      // Continue with the original theme data
    }
    
    return new Response(
      JSON.stringify({ theme: processedTheme, isFallback: false }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error handling get-theme:', error);
    return new Response(
      JSON.stringify({ error: 'Error retrieving theme', details: error.message, theme: defaultFallbackTheme, isFallback: true }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle update-theme operation
async function handleUpdateTheme(data) {
  try {
    console.log("Handling update-theme operation with data:", JSON.stringify(data));
    
    const { themeId, theme, userId } = data;
    
    if (!themeId) {
      return new Response(
        JSON.stringify({ error: 'Missing theme ID' }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Check if the theme exists
    const { data: existingTheme, error: checkError } = await supabaseAdmin
      .from('themes')
      .select('*')
      .eq('id', themeId)
      .single();
    
    if (checkError) {
      return new Response(
        JSON.stringify({ error: 'Error checking theme existence', details: checkError.message }),
        { status: 500, headers: corsHeaders }
      );
    }
    
    if (!existingTheme) {
      return new Response(
        JSON.stringify({ error: 'Theme not found' }),
        { status: 404, headers: corsHeaders }
      );
    }
    
    // Process fields that might need serialization
    const updateData = { ...theme, updated_at: new Date().toISOString() };
    
    if (updateData.design_tokens && typeof updateData.design_tokens === 'object') {
      updateData.design_tokens = JSON.stringify(updateData.design_tokens);
    }
    
    if (updateData.component_tokens && Array.isArray(updateData.component_tokens)) {
      updateData.component_tokens = JSON.stringify(updateData.component_tokens);
    }
    
    if (updateData.composition_rules && typeof updateData.composition_rules === 'object') {
      updateData.composition_rules = JSON.stringify(updateData.composition_rules);
    }
    
    // Update the theme
    const { error: updateError } = await supabaseAdmin
      .from('themes')
      .update(updateData)
      .eq('id', themeId);
    
    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Error updating theme', details: updateError.message }),
        { status: 500, headers: corsHeaders }
      );
    }
    
    // Fetch the updated theme
    const { data: updatedTheme, error: fetchError } = await supabaseAdmin
      .from('themes')
      .select('*')
      .eq('id', themeId)
      .single();
    
    if (fetchError) {
      return new Response(
        JSON.stringify({ error: 'Error fetching updated theme', details: fetchError.message }),
        { status: 500, headers: corsHeaders }
      );
    }
    
    // Process any serialized fields for response
    let processedTheme = { ...updatedTheme };
    
    try {
      // Parse JSON strings for response
      if (typeof processedTheme.design_tokens === 'string') {
        processedTheme.design_tokens = JSON.parse(processedTheme.design_tokens);
      }
      
      if (typeof processedTheme.component_tokens === 'string') {
        processedTheme.component_tokens = JSON.parse(processedTheme.component_tokens);
      }
      
      if (typeof processedTheme.composition_rules === 'string') {
        processedTheme.composition_rules = JSON.parse(processedTheme.composition_rules);
      }
      
      if (typeof processedTheme.cached_styles === 'string') {
        processedTheme.cached_styles = JSON.parse(processedTheme.cached_styles);
      }
    } catch (parseError) {
      console.warn('Error parsing JSON fields in updated theme:', parseError);
      // Continue with the original theme data
    }
    
    return new Response(
      JSON.stringify({ theme: processedTheme, success: true }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error handling update-theme:', error);
    return new Response(
      JSON.stringify({ error: 'Error updating theme', details: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle create-theme operation
async function handleCreateTheme(data) {
  try {
    console.log("Handling create-theme operation with data:", JSON.stringify(data));
    
    const { theme, userId } = data;
    
    if (!theme || !theme.name) {
      return new Response(
        JSON.stringify({ error: 'Missing theme data or name' }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Process fields that might need serialization
    const themeData = { 
      ...theme,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: userId || null
    };
    
    if (themeData.design_tokens && typeof themeData.design_tokens === 'object') {
      themeData.design_tokens = JSON.stringify(themeData.design_tokens);
    }
    
    if (themeData.component_tokens && Array.isArray(themeData.component_tokens)) {
      themeData.component_tokens = JSON.stringify(themeData.component_tokens);
    }
    
    if (themeData.composition_rules && typeof themeData.composition_rules === 'object') {
      themeData.composition_rules = JSON.stringify(themeData.composition_rules);
    }
    
    // Insert the theme
    const { data: newTheme, error: insertError } = await supabaseAdmin
      .from('themes')
      .insert(themeData)
      .select()
      .single();
    
    if (insertError) {
      return new Response(
        JSON.stringify({ error: 'Error creating theme', details: insertError.message }),
        { status: 500, headers: corsHeaders }
      );
    }
    
    // Process any serialized fields for response
    let processedTheme = { ...newTheme };
    
    try {
      // Parse JSON strings for response
      if (typeof processedTheme.design_tokens === 'string') {
        processedTheme.design_tokens = JSON.parse(processedTheme.design_tokens);
      }
      
      if (typeof processedTheme.component_tokens === 'string') {
        processedTheme.component_tokens = JSON.parse(processedTheme.component_tokens);
      }
      
      if (typeof processedTheme.composition_rules === 'string') {
        processedTheme.composition_rules = JSON.parse(processedTheme.composition_rules);
      }
      
      if (typeof processedTheme.cached_styles === 'string') {
        processedTheme.cached_styles = JSON.parse(processedTheme.cached_styles);
      }
    } catch (parseError) {
      console.warn('Error parsing JSON fields in new theme:', parseError);
      // Continue with the original theme data
    }
    
    return new Response(
      JSON.stringify({ theme: processedTheme, success: true }),
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error handling create-theme:', error);
    return new Response(
      JSON.stringify({ error: 'Error creating theme', details: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
