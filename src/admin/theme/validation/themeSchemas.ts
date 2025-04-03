import { z } from 'zod';

// Theme context enum definition that matches Postgres
export const ThemeContextEnum = z.enum(['site', 'admin', 'chat']);
export type ThemeContext = z.infer<typeof ThemeContextEnum>;

// Theme status enum definition that matches Postgres
export const ThemeStatusEnum = z.enum(['draft', 'published', 'archived']);
export type ThemeStatus = z.infer<typeof ThemeStatusEnum>;

// Component Tokens Schema
export const ComponentTokenSchema = z.object({
  id: z.string(),
  component_name: z.string(),
  styles: z.record(z.unknown()),
  description: z.string().nullable().optional(),
  theme_id: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
  context: ThemeContextEnum.optional().default('site')
});

export type SafeComponentToken = z.infer<typeof ComponentTokenSchema>;

// Theme Token Schema
export const ThemeTokenSchema = z.object({
  id: z.string(),
  token_name: z.string(),
  token_value: z.string(),
  category: z.string(),
  description: z.string().nullable().optional(),
  fallback_value: z.string().nullable().optional(),
  theme_id: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional()
});

export type SafeThemeToken = z.infer<typeof ThemeTokenSchema>;

// Impulse Theme Color Schema
const ImpulseColorSchema = z.object({
  primary: z.string().optional(),
  secondary: z.string().optional(),
  accent: z.string().optional(),
  background: z.object({
    main: z.string().optional(),
    overlay: z.string().optional(),
    card: z.string().optional(),
    alt: z.string().optional()
  }).optional(),
  text: z.object({
    primary: z.string().optional(),
    secondary: z.string().optional(),
    accent: z.string().optional(),
    muted: z.string().optional()
  }).optional(),
  borders: z.object({
    normal: z.string().optional(),
    hover: z.string().optional(),
    active: z.string().optional(),
    focus: z.string().optional()
  }).optional(),
  status: z.object({
    success: z.string().optional(),
    warning: z.string().optional(),
    error: z.string().optional(),
    info: z.string().optional()
  }).optional()
});

// Impulse Theme Effects Schema
const ImpulseEffectsSchema = z.object({
  glow: z.object({
    primary: z.string().optional(),
    secondary: z.string().optional(),
    hover: z.string().optional()
  }).optional(),
  gradients: z.object({
    primary: z.string().optional(),
    secondary: z.string().optional(),
    accent: z.string().optional()
  }).optional(),
  shadows: z.object({
    small: z.string().optional(),
    medium: z.string().optional(),
    large: z.string().optional(),
    inner: z.string().optional()
  }).optional()
}).optional();

// Impulse Theme Animation Schema
const ImpulseAnimationSchema = z.object({
  duration: z.object({
    fast: z.string().optional(),
    normal: z.string().optional(),
    slow: z.string().optional()
  }).optional(),
  curves: z.object({
    bounce: z.string().optional(),
    ease: z.string().optional(),
    spring: z.string().optional(),
    linear: z.string().optional()
  }).optional(),
  keyframes: z.record(z.string()).optional()
}).optional();

// Impulse Theme Components Schema
const ImpulseComponentsSchema = z.object({
  panel: z.object({
    radius: z.string().optional(),
    padding: z.string().optional(),
    background: z.string().optional()
  }).optional(),
  button: z.object({
    radius: z.string().optional(),
    padding: z.string().optional(),
    transition: z.string().optional()
  }).optional(),
  tooltip: z.object({
    radius: z.string().optional(),
    padding: z.string().optional(),
    background: z.string().optional()
  }).optional(),
  input: z.object({
    radius: z.string().optional(),
    padding: z.string().optional(),
    background: z.string().optional()
  }).optional()
}).optional();

// Impulse Theme Typography Schema
const ImpulseTypographySchema = z.object({
  fonts: z.object({
    body: z.string().optional(),
    heading: z.string().optional(),
    monospace: z.string().optional()
  }).optional(),
  sizes: z.object({
    xs: z.string().optional(),
    sm: z.string().optional(),
    base: z.string().optional(),
    lg: z.string().optional(),
    xl: z.string().optional(),
    '2xl': z.string().optional(),
    '3xl': z.string().optional(),
    md: z.string().optional()
  }).optional(),
  weights: z.object({
    light: z.number().optional(),
    normal: z.number().optional(),
    medium: z.number().optional(),
    bold: z.number().optional()
  }).optional(),
  lineHeights: z.object({
    tight: z.string().optional(),
    normal: z.string().optional(),
    loose: z.string().optional()
  }).optional()
}).optional();

// Main Impulse Theme Schema
export const ImpulseThemeSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  version: z.string().optional(),
  colors: ImpulseColorSchema.optional(),
  effects: ImpulseEffectsSchema,
  animation: ImpulseAnimationSchema,
  components: ImpulseComponentsSchema,
  typography: ImpulseTypographySchema
});

export type SafeImpulseTheme = z.infer<typeof ImpulseThemeSchema>;

// Base Theme Schema (from DB)
export const BaseThemeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: ThemeStatusEnum,
  is_default: z.boolean(),
  created_by: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  published_at: z.string().optional(),
  version: z.number(),
  cache_key: z.string().optional(),
  parent_theme_id: z.string().optional(),
  design_tokens: z.record(z.unknown()),
  component_tokens: z.array(ComponentTokenSchema).default([]),
  composition_rules: z.record(z.unknown()).optional(),
  cached_styles: z.record(z.unknown()).optional(),
  is_system: z.boolean().optional(),
  is_active: z.boolean().optional()
});

export type SafeBaseTheme = z.infer<typeof BaseThemeSchema>;

// Theme Schema with full Impulse support
export const ThemeSchema = BaseThemeSchema.extend({
  impulse: ImpulseThemeSchema.optional()
});

export type SafeTheme = z.infer<typeof ThemeSchema>;

// Helper functions for safely transforming data
export function isComponentToken(obj: unknown): obj is SafeComponentToken {
  if (!obj || typeof obj !== 'object') return false;
  const token = obj as Partial<SafeComponentToken>;
  return (
    typeof token.id === 'string' &&
    typeof token.component_name === 'string' &&
    token.styles !== undefined
  );
}

export function transformComponentTokens(data: unknown): SafeComponentToken[] {
  if (!Array.isArray(data)) return [];
  
  return data
    .filter(isComponentToken)
    .map(item => ComponentTokenSchema.parse(item));
}

// Utility for safe theme access
export function getSafeThemeProperty<T>(
  theme: unknown,
  path: string[],
  fallback: T
): T {
  try {
    let current: any = theme;
    
    for (const key of path) {
      if (current === undefined || current === null) return fallback;
      current = current[key];
    }
    
    return (current !== undefined && current !== null) ? current : fallback;
  } catch (e) {
    return fallback;
  }
}

// Theme transformation utility
export function transformRawThemeToSafe(rawTheme: unknown): SafeTheme | null {
  try {
    const parsedResult = BaseThemeSchema.safeParse(rawTheme);
    
    if (!parsedResult.success) {
      console.error('Invalid theme structure', parsedResult.error.format());
      return null;
    }
    
    const baseTheme = parsedResult.data;
    
    // Extract and transform impulse properties from design_tokens
    const impulseData = {
      name: baseTheme.name,
      colors: baseTheme.design_tokens?.colors || {},
      effects: baseTheme.design_tokens?.effects || {},
      animation: baseTheme.design_tokens?.animation || {},
      components: baseTheme.design_tokens?.components || {},
      typography: baseTheme.design_tokens?.typography || {}
    };
    
    const impulseResult = ImpulseThemeSchema.safeParse(impulseData);
    
    return {
      ...baseTheme,
      impulse: impulseResult.success ? impulseResult.data : undefined
    };
  } catch (error) {
    console.error('Failed to transform theme', error);
    return null;
  }
}
