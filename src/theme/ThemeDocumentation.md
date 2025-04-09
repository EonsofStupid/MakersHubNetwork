
# MakersImpulse Theme System Documentation

## Overview

The MakersImpulse application uses a multi-layered theme system to provide consistent styling across the application while supporting different visual modes including:

- Site Theme (public/member areas)
- Admin Theme (admin interface)
- Dark/Light modes
- Special effects (cyber, neon, etc.)

## Theme Structure

### 1. CSS Variables

The theme system is primarily built on CSS variables that define colors, spacing, animations, and effects. These variables are organized in several layers:

- **Base Variables** (`site-theme.css`): Core variables like `--site-primary`, `--site-background`, etc.
- **Theme-Specific Variables**: Each theme has its own set of variables (e.g., `--impulse-primary`)
- **Component-Specific Variables**: Some components have their own theme variables

### 2. Theme Providers

Multiple context providers manage theme state:

- `ThemeProvider`: Base shadcn/ui theme provider for dark/light mode
- `SiteThemeProvider`: Main site theme providing variables and component styles
- `AdminThemeProvider`: Admin-specific theme with specialized UI
- `ThemeInitializer`: Coordinates theme loading and fallbacks

### 3. Files Organization

- `/theme/`: Base theme files including variables and utilities
- `/components/theme/`: Theme components and providers
- `/admin/theme/`: Admin-specific themes
- Component-specific styles: Often co-located with components

## Key Theme Files

### Site Theme

- `site-theme.css`: Core variables and utilities
- `SiteThemeProvider.tsx`: Context for site theme
- `ThemeInitializer.tsx`: Handles theme initialization

### Admin Theme

- `impulse-theme.css`: Admin theme variables
- `impulse-admin.css`: Admin component styles
- `cyberpunk-theme.css`: Specialized effects for admin
- `AdminThemeProvider.tsx`: Context for admin theme

## Usage Guidelines

### 1. Components

- Use Tailwind classes as primary styling approach
- For component-specific styles, create a dedicated CSS file
- Apply theme variables through Tailwind classes (e.g., `bg-[var(--site-primary)]`)

### 2. Effects

- Cyber effects: Use classes like `cyber-effect-text`, `site-glow`
- Animations: Use classes like `animate-float`, `animate-pulse-slow`

### 3. Theme Switching

- Use the `toggleDarkMode()` function from `useSiteTheme()` hook
- Admin themes can be switched using `setTheme()` from `useAdminTheme()`

## Special Effects

### Cyber/Neon Effects

- `cyber-effect-text`: Adds glow effect to text
- `site-border-glow`: Adds glow effect to borders
- `mainnav-data-stream`: Creates a data stream background effect

### Animations

- `animate-float`: Creates a floating effect
- `animate-pulse-slow`: Creates a slow pulsing effect
- `animate-data-stream`: Animates data stream background
