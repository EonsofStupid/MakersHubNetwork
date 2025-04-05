
// Theme Service Edge Function
// This function provides access to themes with service role permissions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { z } from 'https://esm.sh/zod@3.22.4';

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

// Define common schemas
const ThemeStatusSchema = z.enum(['draft', 'published', 'archived']);
const ThemeContextSchema = z.enum(['site', 'admin']);

// Define color token schema
const HexColorSchema = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
const ColorTokensSchema = z.object({
  background: HexColorSchema.optional(),
  foreground: HexColorSchema.optional(),
  card: HexColorSchema.optional(),
  cardForeground: HexColorSchema.optional(),
  primary: HexColorSchema.optional(),
  primaryForeground: HexColorSchema.optional(),
  secondary: HexColorSchema.optional(),
  secondaryForeground: HexColorSchema.optional(),
  muted: HexColorSchema.optional(),
  mutedForeground: HexColorSchema.optional(),
  accent: HexColorSchema.optional(),
  accentForeground: HexColorSchema.optional(),
  destructive: HexColorSchema.optional(),
  destructiveForeground: HexColorSchema.optional(),
  border: HexColorSchema.optional(),
  input: HexColorSchema.optional(),
  ring: HexColorSchema.optional(),
}).partial();

// Define effects schema
const EffectsSchema = z.object({
  shadows: z.record(z.unknown()).optional(),
  blurs: z.record(z.unknown()).optional(),
  gradients: z.record(z.unknown()).optional(),
  primary: HexColorSchema.optional(),
  secondary: HexColorSchema.optional(),
  tertiary: HexColorSchema.optional(),
}).partial();

// Define animation schema
const AnimationSchema = z.object({
  keyframes: z.record(z.unknown()).optional(),
  transitions: z.record(z.unknown()).optional(),
  durations: z.record(z.string()).optional(),
}).partial();

// Define design tokens schema
const DesignTokensSchema = z.object({
  colors: ColorTokensSchema.optional(),
  effects: EffectsSchema.optional(),
  animation: AnimationSchema.optional(),
  spacing: z.record(z.unknown()).optional(),
  typography: z.record(z.unknown()).optional(),
}).partial();

// Define theme schema for validation
const BaseThemeSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string().optional(),
  status: ThemeStatusSchema,
  is_default: z.boolean().optional(),
  created_by: z.string().uuid().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  published_at: z.string().optional(),
  version: z.number().optional(),
  cache_key: z.string().optional(),
  parent_theme_id: z.string().uuid().optional(),
  design_tokens: DesignTokensSchema,
  component_tokens: z.array(z.unknown()).optional(),
  composition_rules: z.record(z.unknown()).optional(),
  cached_styles: z.record(z.unknown()).optional(),
}).partial();

// Define request schemas using Zod
const GetThemeRequestSchema = z.object({
  operation: z.literal('get-theme'),
  themeId: z.string().optional(),
  isDefault: z.boolean().optional(),
  context: ThemeContextSchema.optional(),
});

const UpdateThemeRequestSchema = z.object({
  operation: z.literal('update-theme'),
  themeId: z.string().uuid(),
  theme: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    design_tokens: DesignTokensSchema.optional(),
    component_tokens: z.array(z.unknown()).optional(),
    composition_rules: z.record(z.unknown()).optional(),
    is_default: z.boolean().optional(),
  }).strict(),
  userId: z.string().uuid(),
});

const CreateThemeRequestSchema = z.object({
  operation: z.literal('create-theme'),
  theme: z.object({
    name: z.string(),
    description: z.string().optional(),
    status: ThemeStatusSchema,
    is_default: z.boolean().optional(),
    design_tokens: DesignTokensSchema,
    component_tokens: z.array(z.unknown()).optional(),
    composition_rules: z.record(z.unknown()).optional(),
  }),
  userId: z.string().uuid(),
});

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

// Validate theme data for correct formatting
function validateThemeData(themeData: unknown): { isValid: boolean, warnings: string[] } {
  const warnings: string[] = [];
  
  // Basic structure validation
  if (!themeData || typeof themeData !== 'object') {
    warnings.push('Invalid theme structure');
    return { isValid: false, warnings };
  }
  
  try {
    // Use the BaseThemeSchema to validate the core theme structure
    const parseResult = BaseThemeSchema.safeParse(themeData);
    if (!parseResult.success) {
      const issues = parseResult.error.issues;
      warnings.push(...issues.map(issue => `${issue.path.join('.')}: ${issue.message}`));
      return { isValid: false, warnings };
    }
    
    return { isValid: true, warnings };
  } catch (error) {
    warnings.push(`Validation error: ${error instanceof Error ? error.message : String(error)}`);
    return { isValid: false, warnings };
  }
}

// Handle get-theme operation
async function handleGetTheme(data: unknown) {
  try {
    console.log("Handling get-theme operation with data:", JSON.stringify(data));
    
    // Validate request data
    const validationResult = GetThemeRequestSchema.safeParse(data);
    if (!validationResult.success) {
      console.error("Invalid request format:", validationResult.error);
      return new Response(
        JSON.stringify({ error: 'Invalid request parameters', details: validationResult.error.format() }),
        { status: 400, headers: corsHeaders }
      );
    }

    const { themeId, isDefault = true, context = 'site' } = validationResult.data;
    console.log(`Looking for theme with ID: ${themeId || 'default'}, isDefault: ${isDefault}, context: ${context}`);

    // Query for the theme
    let query = supabaseAdmin.from('themes').select('*');
    
    // Apply filters based on parameters
    if (themeId) {
      query = query.eq('id', themeId);
    } else if (isDefault) {
      query = query.eq('is_default', true);
    }

    // Apply context filter - optional for backward compatibility
    if (context) {
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
      return new Response(
        JSON.stringify({ theme: defaultFallbackTheme, isFallback: true }),
        { status: 200, headers: corsHeaders }
      );
    }

    // Validate the theme data
    const theme = themes[0];
    const validation = validateThemeData(theme);
    
    console.log(`Theme found with ID: ${theme.id}`);
    
    // Return the theme with validation status
    return new Response(
      JSON.stringify({ 
        theme: theme, 
        isFallback: false,
        validation
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in handleGetTheme:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to retrieve theme', details: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle update-theme operation
async function handleUpdateTheme(data: unknown) {
  try {
    // Validate request data
    const validationResult = UpdateThemeRequestSchema.safeParse(data);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid theme update data', details: validationResult.error.format() }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    const { themeId, theme, userId } = validationResult.data;
    
    // Check if the theme exists
    const { data: existingTheme, error: checkError } = await supabaseAdmin
      .from('themes')
      .select('id')
      .eq('id', themeId)
      .single();
      
    if (checkError || !existingTheme) {
      return new Response(
        JSON.stringify({ error: 'Theme not found' }),
        { status: 404, headers: corsHeaders }
      );
    }
    
    // Update the theme
    const updateData = {
      ...theme,
      updated_at: new Date().toISOString(),
      updated_by: userId
    };
    
    const { data: updatedTheme, error: updateError } = await supabaseAdmin
      .from('themes')
      .update(updateData)
      .eq('id', themeId)
      .select()
      .single();
      
    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update theme', details: updateError.message }),
        { status: 500, headers: corsHeaders }
      );
    }
    
    return new Response(
      JSON.stringify({ theme: updatedTheme, success: true }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to update theme', details: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle create-theme operation 
async function handleCreateTheme(data: unknown) {
  try {
    // Validate request data
    const validationResult = CreateThemeRequestSchema.safeParse(data);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid theme creation data', details: validationResult.error.format() }),
        { status: 400, headers: corsHeaders }
      );
    }

    const { theme, userId } = validationResult.data;
    
    // Set additional theme properties
    const themeData = {
      ...theme,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: userId,
      version: 1,
      status: theme.status || 'draft',
      // Add missing context field with default value for backward compatibility
      context: 'site'
    };
    
    // Insert the new theme
    const { data: newTheme, error } = await supabaseAdmin
      .from('themes')
      .insert(themeData)
      .select()
      .single();
      
    if (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to create theme', details: error.message }),
        { status: 500, headers: corsHeaders }
      );
    }
    
    return new Response(
      JSON.stringify({ theme: newTheme, success: true }),
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to create theme', details: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: corsHeaders }
    );
  }
}
