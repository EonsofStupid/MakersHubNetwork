
# MakersImpulse Style Guide

## Design Principles

1. **Cyberpunk Aesthetic**: The site uses a modern cyberpunk aesthetic with neon effects, glass morphism, and futuristic elements.
2. **Consistency**: Use the theme system and variables for consistent styling.
3. **Responsiveness**: All components should be responsive and work well on all screen sizes.
4. **Performance**: Optimize animations and effects for good performance.
5. **Accessibility**: Ensure adequate contrast and accessibility features.

## Color Usage

### Primary Palette
- **Primary**: `#00F0FF` - Used for primary actions, highlights, and branding
- **Secondary**: `#FF2D6E` - Used for secondary actions and accents
- **Accent**: `#F97316` - Used for tertiary accents and highlights

### Background Colors
- **Background**: `#080F1E` - Main page background
- **Card**: `#121218` - Card and component backgrounds
- **Overlay**: `rgba(22, 24, 29, 0.85)` - Modal and overlay backgrounds

### Text Colors
- **Primary Text**: `#F6F6F7` - Main text color
- **Secondary Text**: `rgba(255, 255, 255, 0.7)` - Less prominent text
- **Accent Text**: `#00F0FF` - Highlighted text

## Typography

### Fonts
- **Primary Font**: System UI stack for clean, modern appearance
- **Secondary Font**: Monospace for code and technical elements

### Text Sizes
- **Headings**: Use Tailwind's text-2xl, text-xl, etc.
- **Body**: text-base (16px)
- **Small Text**: text-sm or text-xs for captions

## Component Styling

### Buttons
- **Primary**: Solid background, strong hover effect
- **Secondary**: Outlined style with hover glow
- **Ghost**: Minimal styling for less prominent actions

### Cards
- Use glass morphism effect with backdrop-blur
- Subtle border glow on hover
- Consistent padding (p-6 recommended)

### Forms
- Consistent input styling with glowing focus states
- Clear validation states and error messages
- Grouped form controls for better UX

## Special Effects

### Cyber Effects
- `cyber-effect-text`: Text with glow effect
- `site-glow`: Element with glow effect
- `site-border-glow`: Border with glow effect

### Animations
- Use subtle animations for feedback and delight
- Avoid excessive or distracting animations
- Prefer transform and opacity for better performance

## Layout Guidelines

### Spacing
- Use Tailwind's spacing scale consistently
- Maintain breathing room between sections
- Ensure mobile-friendly tap targets (min 44px)

### Grid System
- Use Tailwind's grid and flex utilities
- Maintain consistent gutters between grid items
- Consider mobile-first approach in layouts

## CSS Best Practices

1. **Use Tailwind**: Prefer Tailwind classes for most styling
2. **CSS Variables**: Use the theme variables for colors and effects
3. **Component-Specific Styles**: Use dedicated files for complex components
4. **Responsive Design**: Always ensure layouts work on all screen sizes
5. **Comments**: Document complex CSS patterns and effects

## Theme Implementation

### Variable Usage
```css
/* Using theme variables in custom CSS */
.custom-element {
  color: var(--site-primary);
  background: var(--site-background);
  box-shadow: var(--site-glow);
}
```

### Theme Classes
```tsx
// Using theme utility classes in components
<div className="site-card site-glow-hover">
  <h2 className="cyber-effect-text">Heading</h2>
  <p className="text-muted-foreground">Content</p>
</div>
```
