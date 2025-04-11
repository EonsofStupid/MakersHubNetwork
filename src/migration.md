
# Component Migration Plan

This document outlines the migration plan for moving components from `src/components` to their proper boundaries.

## Migration Goals

1. Move UI components to `src/ui/core`
2. Move theme components to `src/ui/theme`
3. Move profile components to `src/ui/profile`
4. Move auth components to `src/ui/auth`
5. Move admin components to `src/ui/admin`
6. Move keyboard navigation to `src/ui/keyboard`
7. Ensure all boundaries are properly isolated
8. Remove the original `src/components` directory

## Component Mapping

| Original Path | New Path |
|---------------|----------|
| `src/components/ui/*` | `src/ui/core/*` |
| `src/components/theme/*` | `src/ui/theme/*` |
| `src/components/profile/*` | `src/ui/profile/*` |
| `src/components/auth/*` | `src/ui/auth/*` |
| `src/components/admin/*` | `src/ui/admin/*` |
| `src/components/keyboard/*` | `src/ui/keyboard/*` |
| `src/components/ErrorBoundary.tsx` | `src/ui/core/error-boundary.tsx` |
| `src/components/landing/*` | `src/ui/landing/*` |
| `src/components/icons/*` | `src/ui/icons/*` |

## Progress Checklist

- [x] Fix build errors in src/auto-imports.d.ts
- [x] Create src/ui directory structure
- [x] Migrate core UI components
- [x] Migrate theme components 
- [x] Migrate profile components
- [x] Migrate auth components
- [x] Migrate admin components
- [x] Migrate keyboard navigation components
- [x] Migrate landing components
- [x] Update imports project-wide
- [ ] Test thoroughly
- [ ] Remove src/components directory

## How to Test

1. Check build output for errors
2. Verify all components render properly
3. Test key user flows to ensure functionality is preserved

## Cleanup

After confirming all components have been properly migrated and the application works correctly:

```bash
rm -rf src/components
```
